"use strict";

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.GiftPops = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  function createPops(options) {
    var audio = options && options.element;
    var muted = false;
    var runId = 0;
    var heard = {};

    if (audio) {
      audio.loop = false;
      audio.volume = 0.08;
    }

    function silence() {
      if (!audio) return;
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch (err) {
        /* 停不干净也不挡画面 */
      }
    }

    function stop() {
      heard = {};
      silence();
    }

    function unlock() {
      if (!audio) return;
      var volume = audio.volume;
      audio.volume = 0;
      var play = audio.play();
      function reset() {
        audio.pause();
        audio.volume = volume;
        try {
          audio.currentTime = 0;
        } catch (err) {
          /* 停在开头失败也不挡后面的轻响 */
        }
      }
      if (play && typeof play.then === "function") {
        play.then(reset).catch(function () {
          audio.volume = volume;
        });
      } else {
        reset();
      }
    }

    function playOnce(id) {
      if (!audio || muted) return;
      audio.muted = false;
      try {
        audio.currentTime = 0;
      } catch (err) {
        /* 还没准备好就从现在开始播 */
      }
      var play = audio.play();
      if (play && typeof play.catch === "function") {
        play.catch(function () {
          if (id !== undefined) delete heard[id];
        });
      }
    }

    function setMuted(value) {
      muted = Boolean(value);
      if (audio) audio.muted = muted;
      if (muted) silence();
    }

    function tick(state) {
      if (state.runId !== runId) {
        stop();
        runId = state.runId;
      }
      if (state.muted) silence();
      if (state.reduceMotion || state.scene !== 7 || state.finished) return;
      var bursting = state.bursting || [];
      var i;
      for (i = 0; i < bursting.length; i += 1) {
        var id = bursting[i];
        if (heard[id]) continue;
        heard[id] = true;
        if (!state.muted) playOnce(id);
      }
    }

    return {
      tick: tick,
      setMuted: setMuted,
      stop: stop,
      unlock: unlock
    };
  }

  return { createPops: createPops };
});
