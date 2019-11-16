"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = require("./block");
const wallet_1 = require("./wallet");
/**
 * Genesis of the blockchain
 */
function getInitialBlockchain(address) {
    const chain = {
        blocks: [block_1.getGenesisBlock()],
        mempool: [],
        wallet: {
            address,
            balance: 0,
        },
    };
    chain.wallet.balance = wallet_1.getCurrentBalance(chain.wallet.address, chain.blocks);
    return chain;
}
exports.getInitialBlockchain = getInitialBlockchain;
/**
 * Utility to get the last block in a chain
 */
function getLastBlockHash(chain) {
    return chain.blocks[chain.blocks.length - 1].hash;
}
exports.getLastBlockHash = getLastBlockHash;
/**
 * Given a new potential chain, return the new blockchain state
 * by replacing our chain if the new one is valid and longer
 * or keeping our existing chain if the new one is invalid
 */
function getBestChain(chain, newChain) {
    // if chain is not longer than ours or it's invalid, keep our chain
    if (newChain.blocks.length <= chain.blocks.length || !isValidChain(newChain.blocks)) {
        return chain;
    }
    return newChain;
}
exports.getBestChain = getBestChain;
/**
 * When a new block is mined, get the new blockchain state to send to peers
 * and continue working from
 */
function getChainWithNewBlock(chain, block) {
    // filter transactions from the new block out of the mempool
    const transactionIds = block.data.map((tx) => tx.id);
    const blocks = [...chain.blocks, block];
    const mempool = chain.mempool.filter((tx) => {
        return !transactionIds.includes(tx.id);
    });
    return Object.assign(Object.assign({}, chain), { blocks, mempool });
}
exports.getChainWithNewBlock = getChainWithNewBlock;
/**
 * Determine if the provided chain is valid
 */
function isValidChain(newChain) {
    // verify first block is genesis block
    if (JSON.stringify(newChain[0]) !== JSON.stringify(block_1.getGenesisBlock())) {
        return false;
    }
    for (let i = 1; i < newChain.length; i += 1) {
        const current = newChain[i];
        const last = newChain[i - 1];
        // verify provenance of each block
        if (current.lastHash !== last.hash) {
            return false;
        }
        // verify current hash
        if (current.hash !== block_1.hashBlock(current)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2hhaW4vY2hhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBcUQ7QUFDckQscUNBQTZDO0FBSTdDOztHQUVHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQUMsT0FBZTtJQUNsRCxNQUFNLEtBQUssR0FBZTtRQUN4QixNQUFNLEVBQUUsQ0FBQyx1QkFBZSxFQUFFLENBQUM7UUFDM0IsT0FBTyxFQUFFLEVBQUU7UUFDWCxNQUFNLEVBQUU7WUFDTixPQUFPO1lBQ1AsT0FBTyxFQUFFLENBQUM7U0FDWDtLQUNGLENBQUM7SUFFRixLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRywwQkFBaUIsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFN0UsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBYkQsb0RBYUM7QUFFRDs7R0FFRztBQUNILFNBQWdCLGdCQUFnQixDQUFDLEtBQWlCO0lBQ2hELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDcEQsQ0FBQztBQUZELDRDQUVDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLFlBQVksQ0FBQyxLQUFpQixFQUFFLFFBQW9CO0lBQ2xFLG1FQUFtRTtJQUNuRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNuRixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQVBELG9DQU9DO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQUMsS0FBaUIsRUFBRSxLQUFZO0lBQ2xFLDREQUE0RDtJQUM1RCxNQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQXFCLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUV4RSxNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQXFCLEVBQUUsRUFBRTtRQUM3RCxPQUFPLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLENBQUM7SUFFSCx1Q0FBWSxLQUFLLEtBQUUsTUFBTSxFQUFFLE9BQU8sSUFBRztBQUN2QyxDQUFDO0FBVkQsb0RBVUM7QUFFRDs7R0FFRztBQUNILFNBQVMsWUFBWSxDQUFDLFFBQWlCO0lBQ3JDLHNDQUFzQztJQUN0QyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBZSxFQUFFLENBQUMsRUFBRTtRQUNyRSxPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMzQyxNQUFNLE9BQU8sR0FBVSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsTUFBTSxJQUFJLEdBQVUsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUVwQyxrQ0FBa0M7UUFDbEMsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDbEMsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELHNCQUFzQjtRQUN0QixJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN2QyxPQUFPLEtBQUssQ0FBQztTQUNkO0tBQ0Y7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRHZW5lc2lzQmxvY2ssIGhhc2hCbG9jayB9IGZyb20gJy4vYmxvY2snO1xuaW1wb3J0IHsgZ2V0Q3VycmVudEJhbGFuY2UgfSBmcm9tICcuL3dhbGxldCc7XG5cbmltcG9ydCB7IEJsb2NrY2hhaW4sIEJsb2NrLCBTaWduZWRUcmFuc2FjdGlvbiB9IGZyb20gJy4vaW50ZXJmYWNlJztcblxuLyoqXG4gKiBHZW5lc2lzIG9mIHRoZSBibG9ja2NoYWluXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbml0aWFsQmxvY2tjaGFpbihhZGRyZXNzOiBzdHJpbmcpOiBCbG9ja2NoYWluIHtcbiAgY29uc3QgY2hhaW46IEJsb2NrY2hhaW4gPSB7XG4gICAgYmxvY2tzOiBbZ2V0R2VuZXNpc0Jsb2NrKCldLFxuICAgIG1lbXBvb2w6IFtdLFxuICAgIHdhbGxldDoge1xuICAgICAgYWRkcmVzcyxcbiAgICAgIGJhbGFuY2U6IDAsXG4gICAgfSxcbiAgfTtcblxuICBjaGFpbi53YWxsZXQuYmFsYW5jZSA9IGdldEN1cnJlbnRCYWxhbmNlKGNoYWluLndhbGxldC5hZGRyZXNzLCBjaGFpbi5ibG9ja3MpO1xuXG4gIHJldHVybiBjaGFpbjtcbn1cblxuLyoqXG4gKiBVdGlsaXR5IHRvIGdldCB0aGUgbGFzdCBibG9jayBpbiBhIGNoYWluXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMYXN0QmxvY2tIYXNoKGNoYWluOiBCbG9ja2NoYWluKTogc3RyaW5nIHtcbiAgcmV0dXJuIGNoYWluLmJsb2Nrc1tjaGFpbi5ibG9ja3MubGVuZ3RoIC0gMV0uaGFzaDtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIG5ldyBwb3RlbnRpYWwgY2hhaW4sIHJldHVybiB0aGUgbmV3IGJsb2NrY2hhaW4gc3RhdGVcbiAqIGJ5IHJlcGxhY2luZyBvdXIgY2hhaW4gaWYgdGhlIG5ldyBvbmUgaXMgdmFsaWQgYW5kIGxvbmdlclxuICogb3Iga2VlcGluZyBvdXIgZXhpc3RpbmcgY2hhaW4gaWYgdGhlIG5ldyBvbmUgaXMgaW52YWxpZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmVzdENoYWluKGNoYWluOiBCbG9ja2NoYWluLCBuZXdDaGFpbjogQmxvY2tjaGFpbik6IEJsb2NrY2hhaW4ge1xuICAvLyBpZiBjaGFpbiBpcyBub3QgbG9uZ2VyIHRoYW4gb3VycyBvciBpdCdzIGludmFsaWQsIGtlZXAgb3VyIGNoYWluXG4gIGlmIChuZXdDaGFpbi5ibG9ja3MubGVuZ3RoIDw9IGNoYWluLmJsb2Nrcy5sZW5ndGggfHwgIWlzVmFsaWRDaGFpbihuZXdDaGFpbi5ibG9ja3MpKSB7XG4gICAgcmV0dXJuIGNoYWluO1xuICB9XG5cbiAgcmV0dXJuIG5ld0NoYWluO1xufVxuXG4vKipcbiAqIFdoZW4gYSBuZXcgYmxvY2sgaXMgbWluZWQsIGdldCB0aGUgbmV3IGJsb2NrY2hhaW4gc3RhdGUgdG8gc2VuZCB0byBwZWVyc1xuICogYW5kIGNvbnRpbnVlIHdvcmtpbmcgZnJvbVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhaW5XaXRoTmV3QmxvY2soY2hhaW46IEJsb2NrY2hhaW4sIGJsb2NrOiBCbG9jayk6IEJsb2NrY2hhaW4ge1xuICAvLyBmaWx0ZXIgdHJhbnNhY3Rpb25zIGZyb20gdGhlIG5ldyBibG9jayBvdXQgb2YgdGhlIG1lbXBvb2xcbiAgY29uc3QgdHJhbnNhY3Rpb25JZHMgPSBibG9jay5kYXRhLm1hcCgodHg6IFNpZ25lZFRyYW5zYWN0aW9uKSA9PiB0eC5pZCk7XG5cbiAgY29uc3QgYmxvY2tzID0gWy4uLmNoYWluLmJsb2NrcywgYmxvY2tdO1xuICBjb25zdCBtZW1wb29sID0gY2hhaW4ubWVtcG9vbC5maWx0ZXIoKHR4OiBTaWduZWRUcmFuc2FjdGlvbikgPT4ge1xuICAgIHJldHVybiAhdHJhbnNhY3Rpb25JZHMuaW5jbHVkZXModHguaWQpO1xuICB9KTtcblxuICByZXR1cm4geyAuLi5jaGFpbiwgYmxvY2tzLCBtZW1wb29sIH07XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHRoZSBwcm92aWRlZCBjaGFpbiBpcyB2YWxpZFxuICovXG5mdW5jdGlvbiBpc1ZhbGlkQ2hhaW4obmV3Q2hhaW46IEJsb2NrW10pOiBib29sZWFuIHtcbiAgLy8gdmVyaWZ5IGZpcnN0IGJsb2NrIGlzIGdlbmVzaXMgYmxvY2tcbiAgaWYgKEpTT04uc3RyaW5naWZ5KG5ld0NoYWluWzBdKSAhPT0gSlNPTi5zdHJpbmdpZnkoZ2V0R2VuZXNpc0Jsb2NrKCkpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBuZXdDaGFpbi5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IGN1cnJlbnQ6IEJsb2NrID0gbmV3Q2hhaW5baV07XG4gICAgY29uc3QgbGFzdDogQmxvY2sgPSBuZXdDaGFpbltpIC0gMV07XG5cbiAgICAvLyB2ZXJpZnkgcHJvdmVuYW5jZSBvZiBlYWNoIGJsb2NrXG4gICAgaWYgKGN1cnJlbnQubGFzdEhhc2ggIT09IGxhc3QuaGFzaCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIHZlcmlmeSBjdXJyZW50IGhhc2hcbiAgICBpZiAoY3VycmVudC5oYXNoICE9PSBoYXNoQmxvY2soY3VycmVudCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cbiJdfQ==