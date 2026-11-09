"use strict";

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.GiftMusic = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  function createMusic(options) {
    var audio = options && options.element;
    var muted = false;
    var ducked = false;
    var QUIET = 0.22;
    var SOFTER = 0.06;

    function applyLevel() {
      if (!audio) return;
      audio.volume = ducked ? SOFTER : QUIET;
      audio.muted = muted;
    }

    if (audio) {
      audio.loop = true;
      applyLevel();
    }

    function start() {
      if (!audio) return;
      applyLevel();
      try {
        audio.currentTime = 0;
      } catch (err) {
        /* 还没准备好就从现在开始播 */
      }
      var play = audio.play();
      if (play && typeof play.catch === "function") {
        play.catch(function () {
          /* 浏览器拦了声音，画面仍往下走 */
        });
      }
    }

    function restart() {
      if (!audio) return;
      audio.pause();
      start();
    }

    function setMuted(value) {
      muted = Boolean(value);
      applyLevel();
    }

    function duck() {
      ducked = true;
      applyLevel();
    }

    function unduck() {
      ducked = false;
      applyLevel();
    }

    return {
      start: start,
      restart: restart,
      setMuted: setMuted,
      duck: duck,
      unduck: unduck
    };
  }

  return { createMusic: createMusic };
});
