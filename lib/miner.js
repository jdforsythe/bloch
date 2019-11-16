"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chain_1 = require("./chain/chain");
const transaction_1 = require("./chain/transaction");
const block_1 = require("./chain/block");
/**
 * Mine a new block asynchronously
 */
async function mine(chain, difficulty, minerPubKey) {
    const validTransactions = chain.mempool.filter(transaction_1.isValidTransaction);
    // don't mine an empty block
    if (!validTransactions.length) {
        return Promise.reject();
    }
    return new Promise((resolve, reject) => {
        // last block's hash when we started mining
        const lastHash = chain_1.getLastBlockHash(chain);
        // the stuff that doesn't change between iterations
        const baseBlock = {
            lastHash,
            difficulty,
            nonce: undefined,
            timestamp: Date.now(),
            data: [
                transaction_1.getCoinbaseTransaction(minerPubKey),
                ...validTransactions,
            ],
        };
        function doWorkAsync(nonce) {
            const block = getValidBlock(Object.assign(Object.assign({}, baseBlock), { nonce }));
            if (block) {
                return resolve(block);
            }
            // check to see if the last block in the chain is different - in
            // which case mining this block is fruitless
            if (chain_1.getLastBlockHash(chain) !== lastHash) {
                return reject();
            }
            // schedule next nonce - use Timer instead of Promises to avoid blocking
            // by filling the microtask queue or memory hogging
            setTimeout(() => doWorkAsync(nonce + 1), 0);
        }
        doWorkAsync(0);
    });
}
exports.mine = mine;
/**
 * Returns the valid block hash or `false` if nonce makes invalid hash
 */
function getValidBlock(block) {
    const { difficulty } = block;
    const hash = block_1.hashBlock(block);
    return hash.substring(0, difficulty) === '0'.repeat(difficulty) ? Object.assign(Object.assign({}, block), { hash }) : undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbWluZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBaUQ7QUFFakQscURBQWlGO0FBQ2pGLHlDQUEwQztBQUcxQzs7R0FFRztBQUNJLEtBQUssVUFBVSxJQUFJLENBQUMsS0FBaUIsRUFBRSxVQUFrQixFQUFFLFdBQW1CO0lBQ25GLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0NBQWtCLENBQUMsQ0FBQztJQUVuRSw0QkFBNEI7SUFDNUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRTtRQUM3QixPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUN6QjtJQUVELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsMkNBQTJDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLHdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXpDLG1EQUFtRDtRQUNuRCxNQUFNLFNBQVMsR0FBb0I7WUFDakMsUUFBUTtZQUNSLFVBQVU7WUFDVixLQUFLLEVBQUUsU0FBUztZQUNoQixTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNyQixJQUFJLEVBQUU7Z0JBQ0osb0NBQXNCLENBQUMsV0FBVyxDQUFDO2dCQUNuQyxHQUFHLGlCQUFpQjthQUNyQjtTQUNGLENBQUM7UUFFRixTQUFTLFdBQVcsQ0FBQyxLQUFhO1lBQ2hDLE1BQU0sS0FBSyxHQUFHLGFBQWEsaUNBQU0sU0FBUyxLQUFFLEtBQUssSUFBRyxDQUFDO1lBRXJELElBQUksS0FBSyxFQUFFO2dCQUNULE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3ZCO1lBRUQsZ0VBQWdFO1lBQ2hFLDRDQUE0QztZQUM1QyxJQUFJLHdCQUFnQixDQUFDLEtBQUssQ0FBQyxLQUFLLFFBQVEsRUFBRTtnQkFDeEMsT0FBTyxNQUFNLEVBQUUsQ0FBQzthQUNqQjtZQUVELHdFQUF3RTtZQUN4RSxtREFBbUQ7WUFDbkQsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUVELFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUE1Q0Qsb0JBNENDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGFBQWEsQ0FBQyxLQUFzQjtJQUMzQyxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBRTdCLE1BQU0sSUFBSSxHQUFHLGlCQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFOUIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsaUNBQU0sS0FBSyxLQUFFLElBQUksSUFBRyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQ25HLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRMYXN0QmxvY2tIYXNoIH0gZnJvbSAnLi9jaGFpbi9jaGFpbic7XG5cbmltcG9ydCB7IGlzVmFsaWRUcmFuc2FjdGlvbiwgZ2V0Q29pbmJhc2VUcmFuc2FjdGlvbiB9IGZyb20gJy4vY2hhaW4vdHJhbnNhY3Rpb24nO1xuaW1wb3J0IHsgaGFzaEJsb2NrIH0gZnJvbSAnLi9jaGFpbi9ibG9jayc7XG5pbXBvcnQgeyBCbG9ja2NoYWluLCBVbmZpbmlzaGVkQmxvY2ssIEJsb2NrIH0gZnJvbSAnLi9jaGFpbi9pbnRlcmZhY2UnO1xuXG4vKipcbiAqIE1pbmUgYSBuZXcgYmxvY2sgYXN5bmNocm9ub3VzbHlcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbmUoY2hhaW46IEJsb2NrY2hhaW4sIGRpZmZpY3VsdHk6IG51bWJlciwgbWluZXJQdWJLZXk6IHN0cmluZyk6IFByb21pc2U8QmxvY2s+IHtcbiAgY29uc3QgdmFsaWRUcmFuc2FjdGlvbnMgPSBjaGFpbi5tZW1wb29sLmZpbHRlcihpc1ZhbGlkVHJhbnNhY3Rpb24pO1xuXG4gIC8vIGRvbid0IG1pbmUgYW4gZW1wdHkgYmxvY2tcbiAgaWYgKCF2YWxpZFRyYW5zYWN0aW9ucy5sZW5ndGgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgLy8gbGFzdCBibG9jaydzIGhhc2ggd2hlbiB3ZSBzdGFydGVkIG1pbmluZ1xuICAgIGNvbnN0IGxhc3RIYXNoID0gZ2V0TGFzdEJsb2NrSGFzaChjaGFpbik7XG5cbiAgICAvLyB0aGUgc3R1ZmYgdGhhdCBkb2Vzbid0IGNoYW5nZSBiZXR3ZWVuIGl0ZXJhdGlvbnNcbiAgICBjb25zdCBiYXNlQmxvY2s6IFVuZmluaXNoZWRCbG9jayA9IHtcbiAgICAgIGxhc3RIYXNoLFxuICAgICAgZGlmZmljdWx0eSxcbiAgICAgIG5vbmNlOiB1bmRlZmluZWQsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICBkYXRhOiBbXG4gICAgICAgIGdldENvaW5iYXNlVHJhbnNhY3Rpb24obWluZXJQdWJLZXkpLFxuICAgICAgICAuLi52YWxpZFRyYW5zYWN0aW9ucyxcbiAgICAgIF0sXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGRvV29ya0FzeW5jKG5vbmNlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIGNvbnN0IGJsb2NrID0gZ2V0VmFsaWRCbG9jayh7IC4uLmJhc2VCbG9jaywgbm9uY2UgfSk7XG5cbiAgICAgIGlmIChibG9jaykge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShibG9jayk7XG4gICAgICB9XG5cbiAgICAgIC8vIGNoZWNrIHRvIHNlZSBpZiB0aGUgbGFzdCBibG9jayBpbiB0aGUgY2hhaW4gaXMgZGlmZmVyZW50IC0gaW5cbiAgICAgIC8vIHdoaWNoIGNhc2UgbWluaW5nIHRoaXMgYmxvY2sgaXMgZnJ1aXRsZXNzXG4gICAgICBpZiAoZ2V0TGFzdEJsb2NrSGFzaChjaGFpbikgIT09IGxhc3RIYXNoKSB7XG4gICAgICAgIHJldHVybiByZWplY3QoKTtcbiAgICAgIH1cblxuICAgICAgLy8gc2NoZWR1bGUgbmV4dCBub25jZSAtIHVzZSBUaW1lciBpbnN0ZWFkIG9mIFByb21pc2VzIHRvIGF2b2lkIGJsb2NraW5nXG4gICAgICAvLyBieSBmaWxsaW5nIHRoZSBtaWNyb3Rhc2sgcXVldWUgb3IgbWVtb3J5IGhvZ2dpbmdcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gZG9Xb3JrQXN5bmMobm9uY2UgKyAxKSwgMCk7XG4gICAgfVxuXG4gICAgZG9Xb3JrQXN5bmMoMCk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHZhbGlkIGJsb2NrIGhhc2ggb3IgYGZhbHNlYCBpZiBub25jZSBtYWtlcyBpbnZhbGlkIGhhc2hcbiAqL1xuZnVuY3Rpb24gZ2V0VmFsaWRCbG9jayhibG9jazogVW5maW5pc2hlZEJsb2NrKTogQmxvY2sgfCB1bmRlZmluZWQge1xuICBjb25zdCB7IGRpZmZpY3VsdHkgfSA9IGJsb2NrO1xuXG4gIGNvbnN0IGhhc2ggPSBoYXNoQmxvY2soYmxvY2spO1xuXG4gIHJldHVybiBoYXNoLnN1YnN0cmluZygwLCBkaWZmaWN1bHR5KSA9PT0gJzAnLnJlcGVhdChkaWZmaWN1bHR5KSA/IHsgLi4uYmxvY2ssIGhhc2ggfSA6IHVuZGVmaW5lZDtcbn1cbiJdfQ==