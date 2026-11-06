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
    if (audio) {
      audio.loop = true;
      audio.volume = 0.22;
    }

    function start() {
      if (!audio) return;
      audio.muted = muted;
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
      if (audio) audio.muted = muted;
    }

    return {
      start: start,
      restart: restart,
      setMuted: setMuted
    };
  }

  return { createMusic: createMusic };
});
