"use strict";

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.GiftTimeline = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  // 点下之后才计时。第 1 幕到第 6 幕各约 8 秒。约 48 秒进入夜空，约 54 秒定住。
  var LINE_MS = 8000;
  var NIGHT_AT = 48000;
  var LOCK_AT = 54000;

  function createTimeline(options) {
    var now = options && typeof options.now === "function" ? options.now : function () {
      return Date.now();
    };
    var startedAt = null;
    var muted = false;
    var runId = 0;

    function sceneFor(elapsed) {
      if (elapsed < LINE_MS) return 1;
      if (elapsed < LINE_MS * 2) return 2;
      if (elapsed < LINE_MS * 3) return 3;
      if (elapsed < LINE_MS * 4) return 4;
      if (elapsed < LINE_MS * 5) return 5;
      if (elapsed < NIGHT_AT) return 6;
      return 7;
    }

    function snapshot() {
      if (startedAt === null) {
        return {
          scene: 0,
          elapsed: 0,
          playing: false,
          finished: false,
          muted: muted,
          runId: runId
        };
      }
      var elapsed = now() - startedAt;
      if (elapsed < 0) elapsed = 0;
      var scene = sceneFor(elapsed);
      var finished = elapsed >= LOCK_AT;
      return {
        scene: scene,
        elapsed: elapsed,
        playing: !finished,
        finished: finished,
        muted: muted,
        runId: runId
      };
    }

    function start() {
      if (startedAt !== null) return false;
      startedAt = now();
      runId = 1;
      return true;
    }

    function setMuted(value) {
      muted = Boolean(value);
    }

    function replay() {
      if (!snapshot().finished) return false;
      startedAt = now();
      runId += 1;
      return true;
    }

    return {
      start: start,
      setMuted: setMuted,
      replay: replay,
      snapshot: snapshot
    };
  }

  return { createTimeline: createTimeline };
});
