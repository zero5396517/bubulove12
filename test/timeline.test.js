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

test("点了以后第 1 幕到第 6 幕按约 8 秒走，拥抱未结束", function () {
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
  const hug = tl.snapshot();
  assert.equal(hug.scene, 6);
  assert.equal(hug.playing, true);
  assert.equal(hug.finished, false);
});

test("把时钟向前拨过约 8 秒，句子跟着换", function () {
  const c = clock();
  const tl = createTimeline({ now: c.now });
  tl.start();

  const marks = [
    [0, 1, true, false],
    [7999, 1, true, false],
    [8000, 2, true, false],
    [15999, 2, true, false],
    [16000, 3, true, false],
    [23999, 3, true, false],
    [24000, 4, true, false],
    [31999, 4, true, false],
    [32000, 5, true, false],
    [39999, 5, true, false],
    [40000, 6, true, false],
    [47999, 6, true, false],
    [48000, 7, true, false],
    [53999, 7, true, false],
    [54000, 7, false, true]
  ];

  marks.forEach(function (mark) {
    c.set(mark[0]);
    const snap = tl.snapshot();
    assert.equal(snap.scene, mark[1], "t=" + mark[0]);
    assert.equal(snap.playing, mark[2], "playing t=" + mark[0]);
    assert.equal(snap.finished, mark[3], "finished t=" + mark[0]);
  });
});

test("大约 48 秒进入夜空且仍在播、不能重播，大约 54 秒定住", function () {
  const c = clock();
  const tl = createTimeline({ now: c.now });
  tl.start();
  c.set(48000);
  const night = tl.snapshot();
  assert.equal(night.scene, 7);
  assert.equal(night.playing, true);
  assert.equal(night.finished, false);
  assert.equal(tl.replay(), false);
  c.set(54000);
  const locked = tl.snapshot();
  assert.equal(locked.scene, 7);
  assert.equal(locked.playing, false);
  assert.equal(locked.finished, true);
  c.set(180000);
  assert.equal(tl.snapshot().scene, 7);
  assert.equal(tl.snapshot().finished, true);
  assert.equal(tl.replay(), true);
});

test("静音不改变当前幕，重播仍保持静音，再次在大约 54 秒定住", function () {
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
  assert.equal(tl.snapshot().finished, false);
  c.set(54000);
  assert.equal(tl.snapshot().scene, 7);
  assert.equal(tl.snapshot().finished, true);
  assert.equal(tl.replay(), true);
  const again = tl.snapshot();
  assert.equal(again.scene, 1);
  assert.equal(again.playing, true);
  assert.equal(again.finished, false);
  assert.equal(again.muted, true);
  c.set(54000 + 8000);
  assert.equal(tl.snapshot().scene, 2);
  assert.equal(tl.snapshot().muted, true);
  c.set(54000 + 54000);
  assert.equal(tl.snapshot().scene, 7);
  assert.equal(tl.snapshot().finished, true);
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
  c.set(40000);
  assert.equal(tl.replay(), false);
  assert.equal(tl.snapshot().scene, 6);
  c.set(50000);
  assert.equal(tl.replay(), false);
  assert.equal(tl.snapshot().scene, 7);
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
  c.set(16000);
  const next = tl.snapshot();
  assert.equal(next.scene, 3);
  assert.equal(next.runId, before.runId);
});

test("重播从第 1 幕再走一遍，仍是同一条时间轴", function () {
  const c = clock();
  const tl = createTimeline({ now: c.now });
  tl.start();
  const firstRun = tl.snapshot().runId;
  c.set(54000);
  assert.equal(tl.snapshot().finished, true);
  assert.equal(tl.replay(), true);
  const secondRun = tl.snapshot().runId;
  assert.notEqual(secondRun, firstRun);
  assert.equal(tl.snapshot().scene, 1);
  c.set(54000 + 3000);
  assert.equal(tl.replay(), false);
  assert.equal(tl.snapshot().scene, 1);
  assert.equal(tl.snapshot().runId, secondRun);
  c.set(54000 + 8000);
  assert.equal(tl.snapshot().scene, 2);
  assert.equal(tl.snapshot().runId, secondRun);
  const seen = [];
  for (let ms = 0; ms <= 54000; ms += 1000) {
    c.set(54000 + ms);
    const scene = tl.snapshot().scene;
    if (seen[seen.length - 1] !== scene) seen.push(scene);
  }
  assert.deepEqual(seen, [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(tl.snapshot().finished, true);
  assert.equal(tl.snapshot().runId, secondRun);
});
