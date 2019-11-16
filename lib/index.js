"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
console.log('Application starting');
// prevent this from being imported/required - can only be run directly
if (!module.parent) {
    app_1.app();
}
else {
    // throw a fatal error and crash
    throw new Error('[FATAL] Cannot require this app. Crashing.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBNEI7QUFFNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBRXBDLHVFQUF1RTtBQUN2RSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtJQUNsQixTQUFHLEVBQUUsQ0FBQztDQUNQO0tBQ0k7SUFDSCxnQ0FBZ0M7SUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0NBQy9EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXBwIH0gZnJvbSAnLi9hcHAnO1xuXG5jb25zb2xlLmxvZygnQXBwbGljYXRpb24gc3RhcnRpbmcnKTtcblxuLy8gcHJldmVudCB0aGlzIGZyb20gYmVpbmcgaW1wb3J0ZWQvcmVxdWlyZWQgLSBjYW4gb25seSBiZSBydW4gZGlyZWN0bHlcbmlmICghbW9kdWxlLnBhcmVudCkge1xuICBhcHAoKTtcbn1cbmVsc2Uge1xuICAvLyB0aHJvdyBhIGZhdGFsIGVycm9yIGFuZCBjcmFzaFxuICB0aHJvdyBuZXcgRXJyb3IoJ1tGQVRBTF0gQ2Fubm90IHJlcXVpcmUgdGhpcyBhcHAuIENyYXNoaW5nLicpO1xufVxuIl19