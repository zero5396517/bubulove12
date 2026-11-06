"use strict";

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.GiftStage = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  function attach(options) {
    var rootEl = options.root;
    var timeline = options.timeline;
    var music = options.music;
    var script = options.script;
    var lineEl = rootEl.querySelector("[data-line]");
    var gate = rootEl.querySelector("[data-gate]");
    var muteBtn = rootEl.querySelector("[data-mute]");
    var replayBtn = rootEl.querySelector("[data-replay]");
    var lastText = null;

    function renderLine(text, scene) {
      var cut = scene === 5 ? text.indexOf("。") : -1;
      if (cut > 0 && cut < text.length - 1) {
        var head = text.slice(0, cut + 1);
        var lead = document.createElement("span");
        var comma = head.indexOf("，");
        if (comma > 0) {
          var breakHere = document.createElement("br");
          breakHere.className = "narrow";
          lead.append(head.slice(0, comma + 1), breakHere, head.slice(comma + 1));
        } else {
          lead.textContent = head;
        }
        var rest = document.createElement("span");
        rest.textContent = text.slice(cut + 1);
        lineEl.replaceChildren(lead, rest);
        return;
      }
      lineEl.textContent = text;
    }

    rootEl.querySelectorAll("[data-cast] img").forEach(function (img) {
      img.addEventListener("error", function () {
        img.hidden = true;
      });
    });

    muteBtn.addEventListener("click", function () {
      var next = !timeline.snapshot().muted;
      timeline.setMuted(next);
      music.setMuted(next);
      paint();
    });

    replayBtn.addEventListener("click", function () {
      if (!timeline.snapshot().finished) return;
      timeline.replay();
      try {
        music.restart();
      } catch (err) {
        /* 重播时换掉声音失败，画面仍从头走 */
      }
      lastText = null;
      paint();
    });

    function paint() {
      var snap = timeline.snapshot();
      var text = script.textFor(snap.scene, snap.lineIndex);
      rootEl.dataset.scene = String(snap.scene);
      rootEl.dataset.beat = snap.lineIndex == null ? "" : String(snap.lineIndex);
      gate.hidden = snap.scene !== 0;
      muteBtn.hidden = snap.scene === 0;
      replayBtn.hidden = !snap.finished;
      muteBtn.setAttribute("aria-pressed", snap.muted ? "true" : "false");
      muteBtn.textContent = snap.muted ? "开声音" : "静音";
      if (text !== lastText) {
        lastText = text;
        renderLine(text, snap.scene);
        lineEl.hidden = text === "";
        lineEl.classList.remove("is-shown");
        if (text) {
          void lineEl.offsetWidth;
          lineEl.classList.add("is-shown");
        }
      }
    }

    function frame() {
      paint();
      window.requestAnimationFrame(frame);
    }

    paint();
    window.requestAnimationFrame(frame);
    return { paint: paint };
  }

  return { attach: attach };
});
