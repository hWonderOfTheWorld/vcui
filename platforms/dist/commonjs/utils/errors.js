"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorString = void 0;
function getErrorString(error) {
    var _a, _b, _c;
    return `${error.name} - ${error.message}|\
response: Status ${(_a = error.response) === null || _a === void 0 ? void 0 : _a.status} - ${(_b = error.response) === null || _b === void 0 ? void 0 : _b.statusText}|\
response data: ${JSON.stringify((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data)}`;
}
exports.getErrorString = getErrorString;
//# sourceMappingURL=errors.js.map