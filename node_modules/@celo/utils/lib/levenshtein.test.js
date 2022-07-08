"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var levenshtein_1 = require("./levenshtein");
describe('levenshteinDistance()', function () {
    var e_1, _a;
    var cases = [
        {
            a: '',
            b: '',
            distance: 0,
        },
        {
            a: 'foo',
            b: '',
            distance: 3,
        },
        {
            a: 'a',
            b: 'b',
            distance: 1,
        },
        {
            a: 'ab',
            b: 'ac',
            distance: 1,
        },
        {
            a: 'ac',
            b: 'bc',
            distance: 1,
        },
        {
            a: 'abc',
            b: 'axc',
            distance: 1,
        },
        {
            a: 'kitten',
            b: 'sitting',
            distance: 3,
        },
        {
            a: 'xabxcdxxefxgx',
            b: '1ab2cd34ef5g6',
            distance: 6,
        },
        {
            a: 'cat',
            b: 'cow',
            distance: 2,
        },
        {
            a: 'xabxcdxxefxgx',
            b: 'abcdefg',
            distance: 6,
        },
        {
            a: 'javawasneat',
            b: 'scalaisgreat',
            distance: 7,
        },
        {
            a: 'example',
            b: 'samples',
            distance: 3,
        },
        {
            a: 'sturgeon',
            b: 'urgently',
            distance: 6,
        },
        {
            a: 'levenshtein',
            b: 'frankenstein',
            distance: 6,
        },
        {
            a: 'distance',
            b: 'difference',
            distance: 5,
        },
        {
            a: '因為我是中國人所以我會說中文',
            b: '因為我是英國人所以我會說英文',
            distance: 2,
        },
    ];
    var _loop_1 = function (a, b, distance) {
        it("should report a distance of " + distance + " between '" + a + "' and '" + b + "'", function () {
            expect((0, levenshtein_1.levenshteinDistance)(a, b)).toBe(distance);
        });
    };
    try {
        for (var cases_1 = __values(cases), cases_1_1 = cases_1.next(); !cases_1_1.done; cases_1_1 = cases_1.next()) {
            var _b = cases_1_1.value, a = _b.a, b = _b.b, distance = _b.distance;
            _loop_1(a, b, distance);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (cases_1_1 && !cases_1_1.done && (_a = cases_1.return)) _a.call(cases_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
//# sourceMappingURL=levenshtein.test.js.map