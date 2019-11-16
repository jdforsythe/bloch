"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const config_1 = require("./config/config");
const chain_1 = require("./chain/chain");
const wallet_1 = require("./chain/wallet");
const transaction_1 = require("./chain/transaction");
const miner_1 = require("./miner");
const server_1 = require("./p2p-server/server");
const server_2 = require("./http-api/server");
function doWork(chain, broadcast) {
    if (!chain.mempool.length) {
        console.log('No transactions. Delaying...');
        setTimeout(() => doWork(chain, broadcast), 2000);
        return;
    }
    const { difficulty } = config_1.config;
    const { minerPubKey } = env_1.environment;
    console.log('Mining block...');
    miner_1.mine(chain, difficulty, minerPubKey)
        .then((block) => {
        console.log('Found a block!');
        // we have a new block! update our chain and broadcast it to everyone!
        const { blocks, mempool } = chain_1.getChainWithNewBlock(chain, block);
        chain.blocks = blocks;
        chain.mempool = mempool;
        // get our new balance (with any withdrawals and our block reward)
        chain.wallet.balance = wallet_1.getCurrentBalance(chain.wallet.address, chain.blocks);
        broadcast.broadcastChain();
        setTimeout(() => doWork(chain, broadcast), 0);
    })
        .catch(() => {
        console.log('The pool changed');
        // this happens if the chain changes while we're mining this block
        setTimeout(() => doWork(chain, broadcast), 0);
    });
}
/**
 * Run the application
 */
exports.app = () => {
    console.log('Initializing blockchain');
    const chain = chain_1.getInitialBlockchain(env_1.environment.minerPubKey);
    // initialize peer server - answer others
    const p2pServerConfig = {
        chain,
        port: env_1.environment.p2pPort,
        knownPeers: env_1.environment.knownPeers,
        maxPeers: env_1.environment.maxPeers,
        controllers: {
            newChain: (newChain) => {
                const { blocks, mempool } = chain_1.getBestChain(chain, newChain);
                chain.blocks = blocks;
                chain.mempool = mempool;
                chain.wallet.balance = wallet_1.getCurrentBalance(chain.wallet.address, chain.blocks);
            },
            newTransaction: (transaction) => {
                // don't accept a transasction unless the sending user has some coins
                const currentBalance = wallet_1.getCurrentBalance(transaction.input.address, chain.blocks);
                if (currentBalance < transaction.input.amount) {
                    console.error('Possible attempted overspend. Ignoring transaction');
                    return;
                }
                chain.mempool = [...chain.mempool, transaction];
            },
        },
    };
    console.log('Setting up p2p server');
    const broadcast = server_1.listen(p2pServerConfig);
    console.log('Setting up HTTP API');
    const httpServerConfig = {
        chain,
        port: env_1.environment.httpPort,
        host: env_1.environment.httpHost,
        controllers: {
            getBalance: () => {
                chain.wallet.balance = wallet_1.getCurrentBalance(chain.wallet.address, chain.blocks);
                return chain.wallet.balance;
            },
            getBlocks: () => {
                return chain.blocks;
            },
            getMempool: () => {
                return chain.mempool;
            },
            getPublicKey: () => {
                return env_1.environment.minerPubKey;
            },
            sendTransaction: (destAddress, amount) => {
                const { address, balance } = chain.wallet;
                // don't allow two spends in the mempool from the same address
                if (chain.mempool.find((t) => t.input.address === address)) {
                    throw new Error('Please wait until your last transaction is verified');
                }
                console.log(`Sending ${amount} coins to ${destAddress}`);
                const transaction = transaction_1.getNewTransaction(address, destAddress, balance, amount);
                const signed = transaction_1.signTransaction(transaction, env_1.environment.minerPrivKey);
                console.log('Adding signed transaction to the mempool and broadcasting');
                chain.mempool = [...chain.mempool, signed];
                broadcast.broadcastTransaction(signed);
            },
        },
    };
    server_2.listen(httpServerConfig, () => console.log(`Listening on http://${env_1.environment.httpHost}:${env_1.environment.httpPort}`));
    console.log('Starting mining loop');
    doWork(chain, broadcast);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQyw0Q0FBeUM7QUFHekMseUNBQXlGO0FBQ3pGLDJDQUFtRDtBQUNuRCxxREFBeUU7QUFDekUsbUNBQStCO0FBRS9CLGdEQUk2QjtBQUU3Qiw4Q0FHMkI7QUFFM0IsU0FBUyxNQUFNLENBQUMsS0FBaUIsRUFBRSxTQUFpQztJQUNsRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBRTVDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWpELE9BQU87S0FDUjtJQUVELE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxlQUFNLENBQUM7SUFDOUIsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLGlCQUFXLENBQUM7SUFFcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQy9CLFlBQUksQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQztTQUNqQyxJQUFJLENBQUMsQ0FBQyxLQUFZLEVBQUUsRUFBRTtRQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFOUIsc0VBQXNFO1FBQ3RFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsNEJBQW9CLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRS9ELEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRXhCLGtFQUFrRTtRQUNsRSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRywwQkFBaUIsQ0FBQyxL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QUFDLHVCQUF1QixpQkFBVyxDQUFDLFFBQVEsSUFBSSxpQkFBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV2SCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDcEMsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMzQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4vY29uZmlnL2Vudic7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZy9jb25maWcnO1xuXG5pbXBvcnQgeyBCbG9ja2NoYWluLCBCbG9jaywgU2lnbmVkVHJhbnNhY3Rpb24sIFVuc2lnbmVkVHJhbnNhY3Rpb24gfSBmcm9tICcuL2NoYWluL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBnZXRJbml0aWFsQmxvY2tjaGFpbiwgZ2V0QmVzdENoYWluLCBnZXRDaGFpbldpdGhOZXdCbG9jayB9IGZyb20gJy4vY2hhaW4vY2hhaW4nO1xuaW1wb3J0IHsgZ2V0Q3VycmVudEJhbGFuY2UgfSBmcm9tICcuL2NoYWluL3dhbGxldCc7XG5pbXBvcnQgeyBnZXROZXdUcmFuc2FjdGlvbiwgc2lnblRyYW5zYWN0aW9uIH0gZnJvbSAnLi9jaGFpbi90cmFuc2FjdGlvbic7XG5pbXBvcnQgeyBtaW5lIH0gZnJvbSAnLi9taW5lcic7XG5cbmltcG9ydCB7XG4gIFNlcnZlckNvbmZpZyBhcyBQMlBTZXJ2ZXJDb25maWcsXG4gIGxpc3RlbiBhcyBwMnBMaXN0ZW4sXG4gIFNlcnZlckJyb2FkY2FzdE1ldGhvZHMsXG59IGZyb20gJy4vcDJwLXNlcnZlci9zZXJ2ZXInO1xuXG5pbXBvcnQge1xuICBTZXJ2ZXJDb25maWcgYXMgSFRUUFNlcnZlckNvbmZpZyxcbiAgbGlzdGVuIGFzIGh0dHBMaXN0ZW4sXG59IGZyb20gJy4vaHR0cC1hcGkvc2VydmVyJztcblxuZnVuY3Rpb24gZG9Xb3JrKGNoYWluOiBCbG9ja2NoYWluLCBicm9hZGNhc3Q6IFNlcnZlckJyb2FkY2FzdE1ldGhvZHMpIHtcbiAgaWYgKCFjaGFpbi5tZW1wb29sLmxlbmd0aCkge1xuICAgIGNvbnNvbGUubG9nKCdObyB0cmFuc2FjdGlvbnMuIERlbGF5aW5nLi4uJyk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IGRvV29yayhjaGFpbiwgYnJvYWRjYXN0KSwgMjAwMCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB7IGRpZmZpY3VsdHkgfSA9IGNvbmZpZztcbiAgY29uc3QgeyBtaW5lclB1YktleSB9ID0gZW52aXJvbm1lbnQ7XG5cbiAgY29uc29sZS5sb2coJ01pbmluZyBibG9jay4uLicpO1xuICBtaW5lKGNoYWluLCBkaWZmaWN1bHR5LCBtaW5lclB1YktleSlcbiAgICAudGhlbigoYmxvY2s6IEJsb2NrKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnRm91bmQgYSBibG9jayEnKTtcblxuICAgICAgLy8gd2UgaGF2ZSBhIG5ldyBibG9jayEgdXBkYXRlIG91ciBjaGFpbiBhbmQgYnJvYWRjYXN0IGl0IHRvIGV2ZXJ5b25lIVxuICAgICAgY29uc3QgeyBibG9ja3MsIG1lbXBvb2wgfSA9IGdldENoYWluV2l0aE5ld0Jsb2NrKGNoYWluLCBibG9jayk7XG5cbiAgICAgIGNoYWluLmJsb2NrcyA9IGJsb2NrcztcbiAgICAgIGNoYWluLm1lbXBvb2wgPSBtZW1wb29sO1xuXG4gICAgICAvLyBnZXQgb3VyIG5ldyBiYWxhbmNlICh3aXRoIGFueSB3aXRoZHJhd2FscyBhbmQgb3VyIGJsb2NrIHJld2FyZClcbiAgICAgIGNoYWluLndhbGxldC5iYWxhbmNlID0gZ2V0Q3VycmVudEJhbGFuY2UoY2hhaW4ud2FsbGV0LmFkZHJlc3MsIGNoYWluLmJsb2Nrcyk7XG5cbiAgICAgIGJyb2FkY2FzdC5icm9hZGNhc3RDaGFpbigpO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IGRvV29yayhjaGFpbiwgYnJvYWRjYXN0KSwgMCk7XG4gICAgfSlcbiAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1RoZSBwb29sIGNoYW5nZWQnKTtcblxuICAgICAgLy8gdGhpcyBoYXBwZW5zIGlmIHRoZSBjaGFpbiBjaGFuZ2VzIHdoaWxlIHdlJ3JlIG1pbmluZyB0aGlzIGJsb2NrXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IGRvV29yayhjaGFpbiwgYnJvYWRjYXN0KSwgMCk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogUnVuIHRoZSBhcHBsaWNhdGlvblxuICovXG5leHBvcnQgY29uc3QgYXBwID0gKCk6IHZvaWQgPT4ge1xuICBjb25zb2xlLmxvZygnSW5pdGlhbGl6aW5nIGJsb2NrY2hhaW4nKTtcblxuICBjb25zdCBjaGFpbjogQmxvY2tjaGFpbiA9IGdldEluaXRpYWxCbG9ja2NoYWluKGVudmlyb25tZW50Lm1pbmVyUHViS2V5KTtcblxuICAvLyBpbml0aWFsaXplIHBlZXIgc2VydmVyIC0gYW5zd2VyIG90aGVyc1xuICBjb25zdCBwMnBTZXJ2ZXJDb25maWc6IFAyUFNlcnZlckNvbmZpZyA9IHtcbiAgICBjaGFpbixcbiAgICBwb3J0OiBlbnZpcm9ubWVudC5wMnBQb3J0LFxuICAgIGtub3duUGVlcnM6IGVudmlyb25tZW50Lmtub3duUGVlcnMsXG4gICAgbWF4UGVlcnM6IGVudmlyb25tZW50Lm1heFBlZXJzLFxuICAgIGNvbnRyb2xsZXJzOiB7XG4gICAgICBuZXdDaGFpbjogKG5ld0NoYWluOiBCbG9ja2NoYWluKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgYmxvY2tzLCBtZW1wb29sIH0gPSBnZXRCZXN0Q2hhaW4oY2hhaW4sIG5ld0NoYWluKTtcblxuICAgICAgICBjaGFpbi5ibG9ja3MgPSBibG9ja3M7XG4gICAgICAgIGNoYWluLm1lbXBvb2wgPSBtZW1wb29sO1xuXG4gICAgICAgIGNoYWluLndhbGxldC5iYWxhbmNlID0gZ2V0Q3VycmVudEJhbGFuY2UoY2hhaW4ud2FsbGV0LmFkZHJlc3MsIGNoYWluLmJsb2Nrcyk7XG4gICAgICB9LFxuICAgICAgbmV3VHJhbnNhY3Rpb246ICh0cmFuc2FjdGlvbjogU2lnbmVkVHJhbnNhY3Rpb24pID0+IHtcbiAgICAgICAgLy8gZG9uJ3QgYWNjZXB0IGEgdHJhbnNhc2N0aW9uIHVubGVzcyB0aGUgc2VuZGluZyB1c2VyIGhhcyBzb21lIGNvaW5zXG4gICAgICAgIGNvbnN0IGN1cnJlbnRCYWxhbmNlID0gZ2V0Q3VycmVudEJhbGFuY2UodHJhbnNhY3Rpb24uaW5wdXQuYWRkcmVzcywgY2hhaW4uYmxvY2tzKTtcblxuICAgICAgICBpZiAoY3VycmVudEJhbGFuY2UgPCB0cmFuc2FjdGlvbi5pbnB1dC5hbW91bnQpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdQb3NzaWJsZSBhdHRlbXB0ZWQgb3ZlcnNwZW5kLiBJZ25vcmluZyB0cmFuc2FjdGlvbicpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hhaW4ubWVtcG9vbCA9IFsuLi5jaGFpbi5tZW1wb29sLCB0cmFuc2FjdGlvbl07XG4gICAgICB9LFxuICAgIH0sXG4gIH07XG5cbiAgY29uc29sZS5sb2coJ1NldHRpbmcgdXAgcDJwIHNlcnZlcicpO1xuICBjb25zdCBicm9hZGNhc3Q6IFNlcnZlckJyb2FkY2FzdE1ldGhvZHMgPSBwMnBMaXN0ZW4ocDJwU2VydmVyQ29uZmlnKTtcblxuICBjb25zb2xlLmxvZygnU2V0dGluZyB1cCBIVFRQIEFQSScpO1xuICBjb25zdCBodHRwU2VydmVyQ29uZmlnOiBIVFRQU2VydmVyQ29uZmlnID0ge1xuICAgIGNoYWluLFxuICAgIHBvcnQ6IGVudmlyb25tZW50Lmh0dHBQb3J0LFxuICAgIGhvc3Q6IGVudmlyb25tZW50Lmh0dHBIb3N0LFxuICAgIGNvbnRyb2xsZXJzOiB7XG4gICAgICBnZXRCYWxhbmNlOiAoKSA9PiB7XG4gICAgICAgIGNoYWluLndhbGxldC5iYWxhbmNlID0gZ2V0Q3VycmVudEJhbGFuY2UoY2hhaW4ud2FsbGV0LmFkZHJlc3MsIGNoYWluLmJsb2Nrcyk7XG5cbiAgICAgICAgcmV0dXJuIGNoYWluLndhbGxldC5iYWxhbmNlO1xuICAgICAgfSxcbiAgICAgIGdldEJsb2NrczogKCk6IEJsb2NrW10gPT4ge1xuICAgICAgICByZXR1cm4gY2hhaW4uYmxvY2tzO1xuICAgICAgfSxcbiAgICAgIGdldE1lbXBvb2w6ICgpOiBTaWduZWRUcmFuc2FjdGlvbltdID0+IHtcbiAgICAgICAgcmV0dXJuIGNoYWluLm1lbXBvb2w7XG4gICAgICB9LFxuICAgICAgZ2V0UHVibGljS2V5OiAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgcmV0dXJuIGVudmlyb25tZW50Lm1pbmVyUHViS2V5O1xuICAgICAgfSxcbiAgICAgIHNlbmRUcmFuc2FjdGlvbjogKGRlc3RBZGRyZXNzOiBzdHJpbmcsIGFtb3VudDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IHsgYWRkcmVzcywgYmFsYW5jZSB9ID0gY2hhaW4ud2FsbGV0O1xuXG4gICAgICAgIC8vIGRvbid0IGFsbG93IHR3byBzcGVuZHMgaW4gdGhlIG1lbXBvb2wgZnJvbSB0aGUgc2FtZSBhZGRyZXNzXG4gICAgICAgIGlmIChjaGFpbi5tZW1wb29sLmZpbmQoKHQpID0+IHQuaW5wdXQuYWRkcmVzcyA9PT0gYWRkcmVzcykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSB3YWl0IHVudGlsIHlvdXIgbGFzdCB0cmFuc2FjdGlvbiBpcyB2ZXJpZmllZCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGBTZW5kaW5nICR7YW1vdW50fSBjb2lucyB0byAke2Rlc3RBZGRyZXNzfWApO1xuXG4gICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uOiBVbnNpZ25lZFRyYW5zYWN0aW9uID0gZ2V0TmV3VHJhbnNhY3Rpb24oYWRkcmVzcywgZGVzdEFkZHJlc3MsIGJhbGFuY2UsIGFtb3VudCk7XG4gICAgICAgIGNvbnN0IHNpZ25lZDogU2lnbmVkVHJhbnNhY3Rpb24gPSBzaWduVHJhbnNhY3Rpb24odHJhbnNhY3Rpb24sIGVudmlyb25tZW50Lm1pbmVyUHJpdktleSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ0FkZGluZyBzaWduZWQgdHJhbnNhY3Rpb24gdG8gdGhlIG1lbXBvb2wgYW5kIGJyb2FkY2FzdGluZycpO1xuXG4gICAgICAgIGNoYWluLm1lbXBvb2wgPSBbLi4uY2hhaW4ubWVtcG9vbCwgc2lnbmVkXTtcblxuICAgICAgICBicm9hZGNhc3QuYnJvYWRjYXN0VHJhbnNhY3Rpb24oc2lnbmVkKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcblxuICBodHRwTGlzdGVuKGh0dHBTZXJ2ZXJDb25maWcsICgpID0+IGNvbnNvbGUubG9nKGBMaXN0ZW5pbmcgb24gaHR0cDovLyR7ZW52aXJvbm1lbnQuaHR0cEhvc3R9OiR7ZW52aXJvbm1lbnQuaHR0cFBvcnR9YCkpO1xuXG4gIGNvbnNvbGUubG9nKCdTdGFydGluZyBtaW5pbmcgbG9vcCcpO1xuICBkb1dvcmsoY2hhaW4sIGJyb2FkY2FzdCk7XG59O1xuIl19