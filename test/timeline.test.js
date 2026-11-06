"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { createTimeline } = require("../timeline.js");

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
  assert.equal(snap.lineIndex, null);
});

test("点了以后按五幕顺序走，播完停在第 5 幕", function () {
  const c = clock();
  const tl = createTimeline({ now: c.now });
  assert.equal(tl.start(), true);
  const seen = [];
  for (let ms = 0; ms <= 56000; ms += 1000) {
    c.set(ms);
    const scene = tl.snapshot().scene;
    if (seen[seen.length - 1] !== scene) seen.push(scene);
  }
  assert.deepEqual(seen, [1, 2, 3, 4, 5]);
  const end = tl.snapshot();
  assert.equal(end.scene, 5);
  assert.equal(end.playing, false);
  assert.equal(end.finished, true);
  c.set(180000);
  assert.equal(tl.snapshot().scene, 5);
  assert.equal(tl.snapshot().finished, true);
});

test("把时钟向前拨，幕和情话跟着前进", function () {
  const c = clock();
  const tl = createTimeline({ now: c.now });
  tl.start();

  const marks = [
    [0, 1, null],
    [7999, 1, null],
    [8000, 2, null],
    [19999, 2, null],
    [20000, 3, null],
    [31999, 3, null],
    [32000, 4, 0],
    [39999, 4, 0],
    [40000, 4, 1],
    [47999, 4, 1],
    [48000, 4, 2],
    [55999, 4, 2],
    [56000, 5, null]
  ];

  marks.forEach(function (mark) {
    c.set(mark[0]);
    const snap = tl.snapshot();
    assert.equal(snap.scene, mark[1], "t=" + mark[0]);
    assert.equal(snap.lineIndex, mark[2], "line t=" + mark[0]);
    assert.equal(snap.playing, mark[1] !== 5);
    assert.equal(snap.finished, mark[1] === 5);
  });
});

test("静音不改变当前幕，重播仍保持静音", function () {
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
  assert.equal(tl.snapshot().scene, 3);
  assert.equal(tl.snapshot().muted, true);
  c.set(56000);
  assert.equal(tl.snapshot().scene, 5);
  assert.equal(tl.replay(), true);
  const again = tl.snapshot();
  assert.equal(again.scene, 1);
  assert.equal(again.playing, true);
  assert.equal(again.finished, false);
  assert.equal(again.muted, true);
  c.set(56000 + 8000);
  assert.equal(tl.snapshot().scene, 2);
  assert.equal(tl.snapshot().muted, true);
});

test("没播完时不能重播", function () {
  const c = clock();
  const tl = createTimeline({ now: c.now });
  assert.equal(tl.replay(), false);
  tl.start();
  c.set(32000);
  assert.equal(tl.replay(), false);
  assert.equal(tl.snapshot().scene, 4);
  assert.equal(tl.snapshot().lineIndex, 0);
});

test("播放中再次开始不会跳幕，也不会另起一条时间轴", function () {
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
  c.set(20000);
  const next = tl.snapshot();
  assert.equal(next.scene, 3);
  assert.equal(next.runId, before.runId);
});

test("重播从第 1 幕再走一遍，仍是同一条时间轴", function () {
  const c = clock();
  const tl = createTimeline({ now: c.now });
  tl.start();
  const firstRun = tl.snapshot().runId;
  c.set(56000);
  assert.equal(tl.snapshot().finished, true);
  assert.equal(tl.replay(), true);
  const secondRun = tl.snapshot().runId;
  assert.notEqual(secondRun, firstRun);
  assert.equal(tl.snapshot().scene, 1);
  c.set(56000 + 3000);
  assert.equal(tl.replay(), false);
  assert.equal(tl.snapshot().scene, 1);
  assert.equal(tl.snapshot().runId, secondRun);
  c.set(56000 + 8000);
  assert.equal(tl.snapshot().scene, 2);
  assert.equal(tl.snapshot().runId, secondRun);
  const seen = [];
  for (let ms = 0; ms <= 56000; ms += 1000) {
    c.set(56000 + ms);
    const scene = tl.snapshot().scene;
    if (seen[seen.length - 1] !== scene) seen.push(scene);
  }
  assert.deepEqual(seen, [1, 2, 3, 4, 5]);
  assert.equal(tl.snapshot().runId, secondRun);
});
