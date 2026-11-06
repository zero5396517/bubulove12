"use strict";

const assert = require("node:assert/strict");
const { createTimeline } = require("../timeline.js");

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

function clock() {
  let t = 0;
  return {
    now: function () {
      return t;
    },
    set: function (ms) {
      t = ms;
    }
  };
}

test("没点的时候停在邀请", function () {
  const c = clock();
  const tl = createTimeline({ now: c.now });
  c.set(120000);
  const snap = tl.snapshot();
  assert.equal(snap.scene, 0);
  assert.equal(snap.playing, false);
  assert.equal(snap.finished, false);
});

test("点了以后按六句顺序走，播完停在第 6 句", function () {
  const c = clock();
  const tl = createTimeline({ now: c.now });
  assert.equal(tl.start(), true);
  const seen = [];
  for (let ms = 0; ms <= 40000; ms += 1000) {
    c.set(ms);
    const scene = tl.snapshot().scene;
    if (seen[seen.length - 1] !== scene) seen.push(scene);
  }
  assert.deepEqual(seen, [1, 2, 3, 4, 5, 6]);
  const end = tl.snapshot();
  assert.equal(end.scene, 6);
  assert.equal(end.playing, false);
  assert.equal(end.finished, true);
  c.set(180000);
  assert.equal(tl.snapshot().scene, 6);
  assert.equal(tl.snapshot().finished, true);
});

test("把时钟向前拨过约 8 秒，句子跟着换", function () {
  const c = clock();
  const tl = createTimeline({ now: c.now });
  tl.start();

  const marks = [
    [0, 1],
    [7999, 1],
    [8000, 2],
    [15999, 2],
    [16000, 3],
    [23999, 3],
    [24000, 4],
    [31999, 4],
    [32000, 5],
    [39999, 5],
    [40000, 6]
  ];

  marks.forEach(function (mark) {
    c.set(mark[0]);
    const snap = tl.snapshot();
    assert.equal(snap.scene, mark[1], "t=" + mark[0]);
    assert.equal(snap.playing, mark[1] !== 6);
    assert.equal(snap.finished, mark[1] === 6);
  });
});

test("静音不改变当前句，重播仍保持静音", function () {
  const c = clock();
  const tl = createTimeline({ now: c.now });
  tl.start();
  c.set(15000);
  assert.equal(tl.snapshot().scene, 2);
  tl.setMuted(true);
  const muted = tl.snapshot();
  assert.equal(muted.scene, 2);
  assert.equal(muted.playing, true);
  assert.equal(muted.muted, true);
  c.set(25000);
  assert.equal(tl.snapshot().scene, 4);
  assert.equal(tl.snapshot().muted, true);
  c.set(40000);
  assert.equal(tl.snapshot().scene, 6);
  assert.equal(tl.replay(), true);
  const again = tl.snapshot();
  assert.equal(again.scene, 1);
  assert.equal(again.playing, true);
  assert.equal(again.finished, false);
  assert.equal(again.muted, true);
  c.set(40000 + 8000);
  assert.equal(tl.snapshot().scene, 2);
  assert.equal(tl.snapshot().muted, true);
});

test("没播完时不能重播", function () {
  const c = clock();
  const tl = createTimeline({ now: c.now });
  assert.equal(tl.replay(), false);
  tl.start();
  c.set(24000);
  assert.equal(tl.replay(), false);
  assert.equal(tl.snapshot().scene, 4);
});

test("播放中再次开始不会跳句，也不会另起一条时间轴", function () {
  const c = clock();
  const tl = createTimeline({ now: c.now });
  assert.equal(tl.start(), true);
  c.set(10000);
  const before = tl.snapshot();
  assert.equal(before.scene, 2);
  assert.equal(tl.start(), false);
  const after = tl.snapshot();
  assert.equal(after.scene, before.scene);
  assert.equal(after.runId, before.runId);
  assert.equal(after.playing, true);
  c.set(16000);
  const next = tl.snapshot();
  assert.equal(next.scene, 3);
  assert.equal(next.runId, before.runId);
});

test("重播从第 1 句再走一遍，仍是同一条时间轴", function () {
  const c = clock();
  const tl = createTimeline({ now: c.now });
  tl.start();
  const firstRun = tl.snapshot().runId;
  c.set(40000);
  assert.equal(tl.snapshot().finished, true);
  assert.equal(tl.replay(), true);
  const secondRun = tl.snapshot().runId;
  assert.notEqual(secondRun, firstRun);
  assert.equal(tl.snapshot().scene, 1);
  c.set(40000 + 3000);
  assert.equal(tl.replay(), false);
  assert.equal(tl.snapshot().scene, 1);
  assert.equal(tl.snapshot().runId, secondRun);
  c.set(40000 + 8000);
  assert.equal(tl.snapshot().scene, 2);
  assert.equal(tl.snapshot().runId, secondRun);
  const seen = [];
  for (let ms = 0; ms <= 40000; ms += 1000) {
    c.set(40000 + ms);
    const scene = tl.snapshot().scene;
    if (seen[seen.length - 1] !== scene) seen.push(scene);
  }
  assert.deepEqual(seen, [1, 2, 3, 4, 5, 6]);
  assert.equal(tl.snapshot().runId, secondRun);
});
