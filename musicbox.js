"use strict";

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.GiftMusic = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  // 勃拉姆斯《摇篮曲》Wiegenlied Op. 49 No. 4（1868），公有领域。
  // 移到 C 大调，只用旋律，由代码合成音乐盒音色，不收录任何录音。
  var FREQ = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.0,
    A4: 440.0
  };
  var EIGHTH = 0.36;
  var MELODY = [
    ["C4", 1], ["C4", 1], ["E4", 2], [null, 2],
    ["C4", 1], ["C4", 1], ["E4", 2], [null, 2],
    ["C4", 2], ["E4", 2], ["G4", 2],
    ["F4", 2], ["E4", 2], ["D4", 2],
    ["D4", 1], ["D4", 1], ["F4", 2], [null, 2],
    ["D4", 1], ["D4", 1], ["F4", 2], [null, 2],
    ["D4", 2], ["F4", 2], ["A4", 2],
    ["G4", 2], ["F4", 2], ["E4", 2],
    ["C4", 1], ["C4", 1], ["E4", 2], [null, 2],
    ["C4", 1], ["C4", 1], ["E4", 2], [null, 2],
    ["C4", 2], ["E4", 2], ["G4", 2],
    ["F4", 2], ["E4", 2], ["D4", 2],
    ["D4", 1], ["D4", 1], ["F4", 2], [null, 2],
    ["E4", 2], ["D4", 2], ["C4", 2],
    [null, 6]
  ];

  function createMusicBox() {
    var ctx = null;
    var master = null;
    var voice = null;
    var scheduler = null;
    var muted = false;
    var origin = 0;
    var cursor = 0;
    var noteIndex = 0;

    function audioContext() {
      if (typeof window === "undefined") return null;
      return window.AudioContext || window.webkitAudioContext || null;
    }

    function strike(freq, time) {
      var partials = [
        { ratio: 1, amp: 0.42, decay: 1.65 },
        { ratio: 2.76, amp: 0.16, decay: 0.9 },
        { ratio: 5.12, amp: 0.06, decay: 0.45 }
      ];
      partials.forEach(function (partial) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq * partial.ratio, time);
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(partial.amp, time + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + partial.decay);
        osc.connect(gain);
        gain.connect(voice);
        osc.start(time);
        osc.stop(time + partial.decay + 0.04);
      });
    }

    function pump() {
      if (!ctx || !voice) return;
      var now = ctx.currentTime;
      if (origin + cursor < now - 0.6) {
        origin = now + 0.05;
        cursor = 0;
        noteIndex = 0;
      }
      var horizon = now + 0.28;
      var guard = 0;
      while (origin + cursor < horizon && guard < 24) {
        var note = MELODY[noteIndex];
        var when = origin + cursor;
        if (note[0] && when >= now - 0.02) {
          strike(FREQ[note[0]], Math.max(when, now));
        }
        cursor += note[1] * EIGHTH;
        noteIndex += 1;
        if (noteIndex >= MELODY.length) {
          noteIndex = 0;
          origin += cursor;
          cursor = 0;
        }
        guard += 1;
      }
    }

    function dropVoice() {
      if (scheduler) {
        clearInterval(scheduler);
        scheduler = null;
      }
      if (voice) {
        try {
          if (ctx) voice.gain.setValueAtTime(0, ctx.currentTime);
          voice.disconnect();
        } catch (err) {
          /* 已经断开就不用再处理 */
        }
        voice = null;
      }
    }

    function start() {
      var AC = audioContext();
      if (!AC) return;
      if (!ctx) {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.11;
        var filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 4600;
        filter.Q.value = 0.35;
        master.connect(filter);
        filter.connect(ctx.destination);
      }
      dropVoice();
      if (ctx.state === "suspended") ctx.resume();
      voice = ctx.createGain();
      voice.gain.value = muted ? 0 : 1;
      voice.connect(master);
      origin = ctx.currentTime + 0.06;
      cursor = 0;
      noteIndex = 0;
      pump();
      scheduler = setInterval(pump, 80);
    }

    function setMuted(value) {
      muted = Boolean(value);
      if (voice && ctx) {
        voice.gain.cancelScheduledValues(ctx.currentTime);
        voice.gain.setValueAtTime(muted ? 0 : 1, ctx.currentTime);
      }
    }

    return {
      start: start,
      restart: start,
      setMuted: setMuted
    };
  }

  return { createMusicBox: createMusicBox };
});
