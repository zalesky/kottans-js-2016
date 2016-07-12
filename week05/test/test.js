"use strict";
var assert = require("assert");
var add = require("../calc");

describe("Calc-test", function () {

  specify("should return 0 for an empty string", function() {
    assert.equal(add(''), 0);
  });
  specify("should return the same value for 1 argument", function() {
      assert.equal(add('3'), 3);
    });
  specify("should adds 2 inputs separated by coma", function() {
    assert.equal(add('1,2'), 3);
  });
  specify('should handle an unknown amount of numbers', function() {
    assert.equal(add('1,2,3,4,5'), 15);
    assert.equal(add('1,2,3,4,5,1,2,3,4,5,1,2,3,4,5,1,2,3,4,5'), 60);
  });

  it('should handle new lines between numbers', function() {
    assert.equal(add('1,\n2,3,\n4,5'), 15);
  });

  it('should Support different delimiters', function() {
    assert.equal(add('1,\n2,as3,\n4sdd,f5'), 15);
    assert.equal(add('1:,\n2,as3,\n4sdd,f5:'), 15);
  });

  it('negative numbers should return exeption', function() {
    assert.throws(function(){add('-1')}, Error, "negatives not allowed -1");
  });

  it('should ignore numbers bigger than 1000', function() {
    assert.equal(add('1,1001,23000'), 1);
  })
});
