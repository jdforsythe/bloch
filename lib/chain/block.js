"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("../crypto");
/**
 * Get the special "Genesis" block
 */
function getGenesisBlock() {
    return {
        timestamp: 380221200000,
        lastHash: 'bigbang',
        hash: '0000c5f48c60d075730f45945cc7f8cad953e7d0f168186c8c7d3ff07db6f0f7',
        data: [{
                id: 'genesis',
                input: {},
                outputs: [
                    {
                        address: '046acf12468cb92de2e7bf7442987d73c183719454ccd91e42c5785437954c97418ec6fa979c63e82f4dd794db28f86f41ac81275603dbad9f99ac06d5046c133a',
                        amount: 1000,
                    },
                ],
            }],
        nonce: 195250,
        difficulty: 4,
    };
}
exports.getGenesisBlock = getGenesisBlock;
/**
 * Get the hash for a block
 */
function hashBlock(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block;
    return crypto_1.generateHash(`${timestamp}${lastHash}${JSON.stringify(data)}${nonce}${difficulty}`);
}
exports.hashBlock = hashBlock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2hhaW4vYmxvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUM7QUFHekM7O0dBRUc7QUFDSCxTQUFnQixlQUFlO0lBQzdCLE9BQU87UUFDTCxTQUFTLEVBQUUsWUFBWTtRQUN2QixRQUFRLEVBQUUsU0FBUztRQUNuQixJQUFJLEVBQUUsa0VBQWtFO1FBQ3hFLElBQUksRUFBRSxDQUFDO2dCQUNMLEVBQUUsRUFBRSxTQUFTO2dCQUNiLEtBQUssRUFBRSxFQUFFO2dCQUNULE9BQU8sRUFBRTtvQkFDUDt3QkFDRSxPQUFPLEVBQUUsb0lBQW9JO3dCQUM3SSxNQUFNLEVBQUUsSUFBSTtxQkFDYjtpQkFDRjthQUNGLENBQUM7UUFDRixLQUFLLEVBQUUsTUFBTTtRQUNiLFVBQVUsRUFBRSxDQUFDO0tBQ2QsQ0FBQztBQUNKLENBQUM7QUFsQkQsMENBa0JDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixTQUFTLENBQUMsS0FBc0I7SUFDOUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFFL0QsT0FBTyxxQkFBWSxDQUFDLEdBQUcsU0FBUyxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0FBQzdGLENBQUM7QUFKRCw4QkFJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbmVyYXRlSGFzaCB9IGZyb20gJy4uL2NyeXB0byc7XG5pbXBvcnQgeyBVbmZpbmlzaGVkQmxvY2ssIEJsb2NrIH0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuXG4vKipcbiAqIEdldCB0aGUgc3BlY2lhbCBcIkdlbmVzaXNcIiBibG9ja1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2VuZXNpc0Jsb2NrKCk6IEJsb2NrICAge1xuICByZXR1cm4ge1xuICAgIHRpbWVzdGFtcDogMzgwMjIxMjAwMDAwLFxuICAgIGxhc3RIYXNoOiAnYmlnYmFuZycsXG4gICAgaGFzaDogJzAwMDBjNWY0OGM2MGQwNzU3MzBmNDU5NDVjYzdmOGNhZDk1M2U3ZDBmMTY4MTg2YzhjN2QzZmYwN2RiNmYwZjcnLFxuICAgIGRhdGE6IFt7XG4gICAgICBpZDogJ2dlbmVzaXMnLFxuICAgICAgaW5wdXQ6IHt9LFxuICAgICAgb3V0cHV0czogW1xuICAgICAgICB7XG4gICAgICAgICAgYWRkcmVzczogJzA0NmFjZjEyNDY4Y2I5MmRlMmU3YmY3NDQyOTg3ZDczYzE4MzcxOTQ1NGNjZDkxZTQyYzU3ODU0Mzc5NTRjOTc0MThlYzZmYTk3OWM2M2U4MmY0ZGQ3OTRkYjI4Zjg2ZjQxYWM4MTI3NTYwM2RiYWQ5Zjk5YWMwNmQ1MDQ2YzEzM2EnLFxuICAgICAgICAgIGFtb3VudDogMTAwMCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfV0sXG4gICAgbm9uY2U6IDE5NTI1MCxcbiAgICBkaWZmaWN1bHR5OiA0LFxuICB9O1xufVxuXG4vKipcbiAqIEdldCB0aGUgaGFzaCBmb3IgYSBibG9ja1xuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzaEJsb2NrKGJsb2NrOiBVbmZpbmlzaGVkQmxvY2spOiBzdHJpbmcge1xuICBjb25zdCB7IHRpbWVzdGFtcCwgbGFzdEhhc2gsIGRhdGEsIG5vbmNlLCBkaWZmaWN1bHR5IH0gPSBibG9jaztcblxuICByZXR1cm4gZ2VuZXJhdGVIYXNoKGAke3RpbWVzdGFtcH0ke2xhc3RIYXNofSR7SlNPTi5zdHJpbmdpZnkoZGF0YSl9JHtub25jZX0ke2RpZmZpY3VsdHl9YCk7XG59XG4iXX0=