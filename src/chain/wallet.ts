import {
  Block,
  SignedTransactionInput,
  TransactionOutput,
  SignedTransaction,
  CoinbaseTransaction,
} from './interface';

/**
 * Get the current balance for any wallet address
 *
 * Last known balance is the last time the user sent coins anywhere (their address
 * was the input address to a transaction) because they have to send their whole
 * balance. If they've never sent coins, start with zero.
 *
 * From that known point, we add up all the coinbase amounts and deposits thereafter
 * and accumulate a balance
 */
export function getCurrentBalance(address: string, blocks: Block[]) {
  let initialBalance = 0;

  const blocksSinceLastSpend: Block[] = getDescendingBlocksSince(blocks, (b: Block) => {
    // does the block have an input address matching the given address?
    return !!b.data.slice(1).find((tx: SignedTransaction) => tx.input.address === address);
  });

  // they spent at some time in the block history
  if (blocksSinceLastSpend.length !== blocks.length) {
    const lastSpendBlock = blocksSinceLastSpend.pop();

    const lastSpendTx = <SignedTransaction> lastSpendBlock.data.slice(1).reverse().find((tx: SignedTransaction) => tx.input.address === address);

    // the last known balance is the output amount to the same wallet in the last spend transaction
    initialBalance = lastSpendTx.outputs.find((txOut: TransactionOutput) => txOut.address === address).amount;

    // if the same user got the block reward on that block, add that in as well
    const lastSpendCoinbaseDeposit = lastSpendBlock.data[0].outputs[0];

    if (lastSpendCoinbaseDeposit.address === address) {
      initialBalance += lastSpendCoinbaseDeposit.amount;
    }
  }

  return getAccumulatedBalance(initialBalance, address, blocksSinceLastSpend);
}

/**
 * Get blocks, in descending order, until the block matches the predicate (inclusive of the match)
 */
function getDescendingBlocksSince(allBlocks: Block[], predicateFn: (b: Block) => boolean): Block[] {
  const descending = [...allBlocks].reverse();

  const blocksSince: Block[] = [];

  for (const block of descending) {
    blocksSince.push(block);

    if (predicateFn(block)) {
      break;
    }
  }

  return blocksSince;
}

function getCoinbaseDeposits(address: string, coinbaseTxs: CoinbaseTransaction[]): TransactionOutput[] {
  return coinbaseTxs.reduce(
    (acc, coinbaseTx: CoinbaseTransaction) => {
      acc.push(...coinbaseTx.outputs.filter((outputTx: TransactionOutput) => outputTx.address === address));

      return acc;
    },
    [],
  );
}

interface TransactionsAndCoinbases {
  coinbaseTxs: CoinbaseTransaction[];
  transactions: SignedTransaction[];
}

function getTransactionsAndCoinbases(blocks: Block[]): TransactionsAndCoinbases {
  return blocks.reduce(
    (acc, block: Block) => {
      acc.coinbaseTxs.push(block.data[0]);
      acc.transactions.push(...block.data.slice(1));

      return acc;
    },
    { coinbaseTxs: [], transactions: [] },
  );
}

interface WithdrawalsAndDeposits {
  withdrawals: SignedTransactionInput[];
  deposits: TransactionOutput[];
}

function getWithdrawalsAndDeposits(address: string, transactions: SignedTransaction[]): WithdrawalsAndDeposits {
  return transactions.reduce(
    (acc, transaction: SignedTransaction) => {
      if (transaction.input.address === address) {
        acc.withdrawals.push(transaction.input);
      }

      acc.deposits.push(...transaction.outputs.filter((outputTx: TransactionOutput) => outputTx.address === address));

      return acc;
    },
    { withdrawals: [], deposits: [] },
  );
}

function getAccumulatedBalance(initialBalance: number, address: string, blocks: Block[]) {
  const { coinbaseTxs, transactions } = getTransactionsAndCoinbases(blocks);
  const { withdrawals, deposits } = getWithdrawalsAndDeposits(address, transactions);

  // we also need to check if we have any coinbase (block reward) deposits to add
  deposits.push(...getCoinbaseDeposits(address, coinbaseTxs));

  const balance: number = withdrawals.reduce(
    (acc, inputTx) => acc - inputTx.amount,
    initialBalance,
  );

  return deposits.reduce((acc, outputTx) => acc + outputTx.amount, balance);
}
