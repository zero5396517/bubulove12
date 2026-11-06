"use strict";

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.GiftTimeline = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  // 点下之后才计时。第 5 幕没有时长，句子出现后停住。
  var SCENE_ENDS = [8000, 20000, 32000, 56000];
  var LINE_MS = 8000;

  function createTimeline(options) {
    var now = options && typeof options.now === "function" ? options.now : function () {
      return Date.now();
    };
    var startedAt = null;
    var muted = false;
    var runId = 0;

    function sceneFor(elapsed) {
      if (elapsed < SCENE_ENDS[0]) return 1;
      if (elapsed < SCENE_ENDS[1]) return 2;
      if (elapsed < SCENE_ENDS[2]) return 3;
      if (elapsed < SCENE_ENDS[3]) return 4;
      return 5;
    }

    function lineIndexFor(elapsed, scene) {
      if (scene !== 4) return null;
      var index = Math.floor((elapsed - SCENE_ENDS[2]) / LINE_MS);
      if (index < 0) return 0;
      if (index > 2) return 2;
      return index;
    }

    function snapshot() {
      if (startedAt === null) {
        return {
          scene: 0,
          playing: false,
          finished: false,
          muted: muted,
          lineIndex: null,
          runId: runId
        };
      }
      var elapsed = now() - startedAt;
      if (elapsed < 0) elapsed = 0;
      var scene = sceneFor(elapsed);
      var finished = scene === 5;
      return {
        scene: scene,
        playing: !finished,
        finished: finished,
        muted: muted,
        lineIndex: lineIndexFor(elapsed, scene),
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
