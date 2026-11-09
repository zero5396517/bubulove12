"use strict";

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.GiftVoices = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  function createVoices(options) {
    var script = options.script;
    var music = options.music;
    var count = script.count;
    var audios = [];
    var tokens = [];
    var muted = false;
    var primed = false;
    var runId = 0;
    var seenScene = 0;
    var sawFinished = false;
    var current = null;
    var i;

    function bump(index) {
      tokens[index] = (tokens[index] || 0) + 1;
      return tokens[index];
    }

    function unduck() {
      if (music && typeof music.unduck === "function") music.unduck();
    }

    function duck() {
      if (muted) return;
      if (music && typeof music.duck === "function") music.duck();
    }

    function stopCurrent() {
      if (!current) {
        unduck();
        return;
      }
      var audio = current.audio;
      bump(current.index);
      audio.muted = true;
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch (err) {
        /* 停不干净也不挡画面 */
      }
      current = null;
      unduck();
    }

    function playIndex(index) {
      stopCurrent();
      if (muted) return;
      var audio = audios[index];
      var line = script.lineAt(index);
      if (!audio || !line) {
        unduck();
        return;
      }
      var token = bump(index);
      audio.muted = false;
      audio.volume = 1;
      try {
        audio.currentTime = 0;
      } catch (err) {
        /* 还没准备好就从现在开始播 */
      }
      duck();
      current = { index: index, audio: audio, token: token };
      var play;
      try {
        play = audio.play();
      } catch (err) {
        current = null;
        unduck();
        return;
      }
      if (play && typeof play.then === "function") {
        play.then(function () {
          if (tokens[index] !== token || muted) {
            audio.pause();
            if (current && current.token === token) {
              current = null;
              unduck();
            }
          }
        }).catch(function () {
          if (current && current.token === token) {
            current = null;
            unduck();
          }
        });
      }
    }

    function onQuiet(audio) {
      if (current && current.audio === audio) {
        current = null;
        unduck();
      }
    }

    for (i = 0; i < count; i += 1) {
      var line = script.lineAt(i);
      var audio = new Audio(line.voice);
      audio.preload = "auto";
      (function (el) {
        el.addEventListener("ended", function () { onQuiet(el); });
        el.addEventListener("error", function () { onQuiet(el); });
      })(audio);
      audios.push(audio);
    }

    function durationMs(index) {
      var line = script.lineAt(index);
      var fallback = line ? line.fallbackMs : 0;
      var audio = audios[index];
      if (audio && isFinite(audio.duration) && audio.duration > 0) return audio.duration * 1000;
      return fallback;
    }

    function prime(index) {
      var audio = audios[index];
      if (!audio) return;
      var token = bump(index);
      var volume = audio.volume;
      audio.volume = 0;
      var play;
      try {
        play = audio.play();
      } catch (err) {
        audio.volume = volume;
        return;
      }
      function reset() {
        if (tokens[index] !== token) return;
        if (current && current.audio === audio) {
          audio.volume = 1;
          return;
        }
        audio.pause();
        audio.volume = volume;
        try {
          audio.currentTime = 0;
        } catch (err) {
          /* 停在开头失败也不挡后面的口播 */
        }
      }
      if (play && typeof play.then === "function") {
        play.then(reset).catch(function () {
          if (tokens[index] === token) audio.volume = volume;
        });
      } else {
        reset();
      }
    }

    function unlock() {
      if (primed) return;
      primed = true;
      var n;
      for (n = 0; n < audios.length; n += 1) prime(n);
    }

    function setMuted(value) {
      muted = Boolean(value);
      var n;
      for (n = 0; n < audios.length; n += 1) audios[n].muted = muted;
      if (muted) stopCurrent();
    }

    function sync(snap) {
      if (!snap || !snap.scene) return;
      if (Boolean(snap.muted) !== muted) setMuted(snap.muted);
      if (snap.runId !== runId) {
        stopCurrent();
        runId = snap.runId;
        seenScene = 0;
        sawFinished = false;
      }
      // 幕一旦跨过就记下来。静音时错过的句子不再补放。
      if (snap.scene >= 1 && snap.scene <= 5 && snap.scene > seenScene) {
        var atStart = snap.scene === seenScene + 1;
        seenScene = snap.scene;
        if (atStart && !muted) playIndex(snap.scene - 1);
      } else if (snap.scene > seenScene) {
        seenScene = snap.scene;
      }
      if (snap.finished && !sawFinished) {
        sawFinished = true;
        if (!muted) playIndex(5);
      }
    }

    return {
      unlock: unlock,
      sync: sync,
      setMuted: setMuted,
      durationMs: durationMs
    };
  }

  return { createVoices: createVoices };
});
