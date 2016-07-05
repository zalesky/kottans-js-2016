"use strict";
var assert = require("assert");
var ExtendedPromise = require("../script");
describe("ExtendedPromise.map-test", function () {

    function mapper(val) {
        return val * 2;
    }

    function deferredMapper(val) {
        return ExtendedPromise.delay(1, mapper(val));
    }

    specify("should map input values array", function() {
        var input = [1, 2, 3];
        return ExtendedPromise.map(input, mapper).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should map input ExtendedPromises array", function() {
        var input = [ExtendedPromise.resolve(1), ExtendedPromise.resolve(2), ExtendedPromise.resolve(3)];
        return ExtendedPromise.map(input, mapper).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should map mixed input array", function() {
        var input = [1, ExtendedPromise.resolve(2), 3];
        return ExtendedPromise.map(input, mapper).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should map input when mapper returns a ExtendedPromise", function() {
        var input = [1,2,3];
        return ExtendedPromise.map(input, deferredMapper).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should accept a ExtendedPromise for an array", function() {
        return ExtendedPromise.map(ExtendedPromise.resolve([1, ExtendedPromise.resolve(2), 3]), mapper).then(
            function(result) {
                assert.deepEqual(result, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should throw a TypeError when input ExtendedPromise does not resolve to an array", function() {
        return ExtendedPromise.map(ExtendedPromise.resolve(123), mapper).caught(TypeError, function(e){
        });
    });

    specify("should map input ExtendedPromises when mapper returns a ExtendedPromise", function() {
        var input = [ExtendedPromise.resolve(1),ExtendedPromise.resolve(2),ExtendedPromise.resolve(3)];
        return ExtendedPromise.map(input, mapper).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should reject when input contains rejection", function() {
        var input = [ExtendedPromise.resolve(1), ExtendedPromise.reject(2), ExtendedPromise.resolve(3)];
        return ExtendedPromise.map(input, mapper).then(
            assert.fail,
            function(result) {
                assert(result === 2);
            }
        );
    });
});

describe("ExtendedPromise.map-test with concurrency", function () {

    var concurrency = {concurrency: 2};

    function mapper(val) {
        return val * 2;
    }

    function deferredMapper(val) {
        return ExtendedPromise.delay(1, mapper(val));
    }

    specify("should map input values array with concurrency", function() {
        var input = [1, 2, 3];
        return ExtendedPromise.map(input, mapper, concurrency).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should map input ExtendedPromises array with concurrency", function() {
        var input = [ExtendedPromise.resolve(1), ExtendedPromise.resolve(2), ExtendedPromise.resolve(3)];
        return ExtendedPromise.map(input, mapper, concurrency).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should map mixed input array with concurrency", function() {
        var input = [1, ExtendedPromise.resolve(2), 3];
        return ExtendedPromise.map(input, mapper, concurrency).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should map input when mapper returns a ExtendedPromise with concurrency", function() {
        var input = [1,2,3];
        return ExtendedPromise.map(input, deferredMapper, concurrency).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should accept a ExtendedPromise for an array with concurrency", function() {
        return ExtendedPromise.map(ExtendedPromise.resolve([1, ExtendedPromise.resolve(2), 3]), mapper, concurrency).then(
            function(result) {
                assert.deepEqual(result, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should resolve to empty array when input ExtendedPromise does not resolve to an array with concurrency", function() {
        return ExtendedPromise.map(ExtendedPromise.resolve(123), mapper, concurrency).caught(TypeError, function(e){
        });
    });

    specify("should map input ExtendedPromises when mapper returns a ExtendedPromise with concurrency", function() {
        var input = [ExtendedPromise.resolve(1),ExtendedPromise.resolve(2),ExtendedPromise.resolve(3)];
        return ExtendedPromise.map(input, mapper, concurrency).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should reject when input contains rejection with concurrency", function() {
        var input = [ExtendedPromise.resolve(1), ExtendedPromise.reject(2), ExtendedPromise.resolve(3)];
        return ExtendedPromise.map(input, mapper, concurrency).then(
            assert.fail,
            function(result) {
                assert(result === 2);
            }
        );
    });

    specify("should not have more than {concurrency} ExtendedPromises in flight", function() {
        var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var b = [];
        var now = Date.now();

        var immediates = [];
        function immediate(index) {
            var resolve;
            var ret = new ExtendedPromise(function(){resolve = arguments[0]});
            immediates.push([ret, resolve, index]);
            return ret;
        }

        var lates = [];
        function late(index) {
            var resolve;
            var ret = new ExtendedPromise(function(){resolve = arguments[0]});
            lates.push([ret, resolve, index]);
            return ret;
        }


        function ExtendedPromiseByIndex(index) {
            return index < 5 ? immediate(index) : late(index);
        }

        function resolve(item) {
            item[1](item[2]);
        }

        var ret1 = ExtendedPromise.map(array, function(value, index) {
            return ExtendedPromiseByIndex(index).then(function() {
                b.push(value);
            });
        }, {concurrency: 5});

        var ret2 = ExtendedPromise.delay(100).then(function() {
            assert.strictEqual(0, b.length);
            immediates.forEach(resolve);
            return immediates.map(function(item){return item[0]});
        }).delay(100).then(function() {
            assert.deepEqual(b, [0, 1, 2, 3, 4]);
            lates.forEach(resolve);
        }).delay(100).then(function() {
            assert.deepEqual(b, [0, 1, 2, 3, 4, 10, 9, 8, 7, 6 ]);
            lates.forEach(resolve);
        }).thenReturn(ret1).then(function() {
            assert.deepEqual(b, [0, 1, 2, 3, 4, 10, 9, 8, 7, 6, 5]);
        });
        return ExtendedPromise.all([ret1, ret2]);
    });
});