"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var parsing_1 = require("./parsing");
test('stringToBoolean()', function () {
    expect((0, parsing_1.stringToBoolean)('true')).toBe(true);
    expect((0, parsing_1.stringToBoolean)('      true    ')).toBe(true);
    expect((0, parsing_1.stringToBoolean)('false')).toBe(false);
    expect((0, parsing_1.stringToBoolean)('      false   ')).toBe(false);
    expect((0, parsing_1.stringToBoolean)('FaLse')).toBe(false);
    expect((0, parsing_1.stringToBoolean)('TruE')).toBe(true);
    expect(function () { return (0, parsing_1.stringToBoolean)('fals'); }).toThrow("Unable to parse 'fals' as boolean");
});
test('stringToBigNum()', function () {
    expect((0, parsing_1.parseInputAmount)('.1')).toStrictEqual(new bignumber_js_1.default('0.1'));
    expect((0, parsing_1.parseInputAmount)('.1 ')).toStrictEqual(new bignumber_js_1.default('0.1'));
    expect((0, parsing_1.parseInputAmount)('1.')).toStrictEqual(new bignumber_js_1.default('1'));
    expect((0, parsing_1.parseInputAmount)('0')).toStrictEqual(new bignumber_js_1.default('0'));
    expect((0, parsing_1.parseInputAmount)('')).toStrictEqual(new bignumber_js_1.default('0'));
    expect((0, parsing_1.parseInputAmount)('1.23')).toStrictEqual(new bignumber_js_1.default('1.23'));
    expect((0, parsing_1.parseInputAmount)('1,23')).toStrictEqual(new bignumber_js_1.default(NaN));
    expect((0, parsing_1.parseInputAmount)('1,23', ',')).toStrictEqual(new bignumber_js_1.default('1.23'));
});
//# sourceMappingURL=parsing.test.js.map