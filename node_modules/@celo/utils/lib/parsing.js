"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInputAmount = exports.stringToBoolean = exports.parseSolidityStringArray = void 0;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
// Exports moved to @celo/base, forwarding them
// here for backwards compatibility
var parsing_1 = require("@celo/base/lib/parsing");
Object.defineProperty(exports, "parseSolidityStringArray", { enumerable: true, get: function () { return parsing_1.parseSolidityStringArray; } });
Object.defineProperty(exports, "stringToBoolean", { enumerable: true, get: function () { return parsing_1.stringToBoolean; } });
var parseInputAmount = function (inputString, decimalSeparator) {
    if (decimalSeparator === void 0) { decimalSeparator = '.'; }
    if (decimalSeparator !== '.') {
        inputString = inputString.replace(decimalSeparator, '.');
    }
    return new bignumber_js_1.default(inputString || '0');
};
exports.parseInputAmount = parseInputAmount;
//# sourceMappingURL=parsing.js.map