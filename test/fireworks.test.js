"use strict";

const assert = require("node:assert/strict");
const fireworks = require("../fireworks.js");

let test;
try {
  test = require("node:test");
} catch (err) {
  test = function (name, fn) {
    try {
      fn();
      console.log("ok - " + name);
    } catch (e) {
      console.error("not ok - " + name);
      console.error(e);
      process.exitCode = 1;
    }
  };
}

test("定住之后再往后走，火花位置和亮度不再变", function () {
  const locked = fireworks.frameAt(6000);
  const later = fireworks.frameAt(12000);
  assert.equal(locked.locked, true);
  assert.equal(later.locked, true);
  assert.equal(locked.embers, false);
  assert.equal(later.embers, false);
  assert.equal(locked.sparks.length, later.sparks.length);
  assert.ok(locked.sparks.length > 0);
  locked.sparks.forEach(function (spark, i) {
    const other = later.sparks[i];
    assert.equal(spark.x, other.x);
    assert.equal(spark.y, other.y);
    assert.equal(spark.alpha, other.alpha);
    assert.equal(spark.kind, other.kind);
  });
});

test("定住之前还会炸开，不会提前冻住", function () {
  const mid = fireworks.frameAt(2600);
  assert.equal(mid.locked, false);
  assert.ok(mid.bursting.length > 0);
  assert.ok(mid.sparks.length > 0);
});
