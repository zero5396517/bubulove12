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
    var pictures = options.pictures;
    var lineEl = rootEl.querySelector("[data-line]");
    var gate = rootEl.querySelector("[data-gate]");
    var muteBtn = rootEl.querySelector("[data-mute]");
    var replayBtn = rootEl.querySelector("[data-replay]");
    var layers = rootEl.querySelectorAll("[data-cast] img");
    var front = 0;
    var lastScene = null;
    var lastText = null;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    Array.prototype.forEach.call(layers, function (img) {
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
      lastScene = null;
      paint();
    });

    function srcFor(pic) {
      if (!pic) return "";
      if (reduceMotion.matches && pic.still) return pic.still;
      return pic.src;
    }

    function showPicture(scene) {
      if (scene === lastScene) return;
      lastScene = scene;
      var pic = pictures.pictureFor(scene);
      var incoming = layers[1 - front];
      var outgoing = layers[front];
      if (!incoming || !outgoing) return;
      if (!pic) {
        incoming.classList.remove("is-on");
        outgoing.classList.remove("is-on");
        incoming.hidden = true;
        outgoing.hidden = true;
        incoming.removeAttribute("src");
        outgoing.removeAttribute("src");
        return;
      }
      var src = srcFor(pic);
      incoming.hidden = false;
      if (incoming.getAttribute("src") !== src) {
        incoming.src = src;
      }
      incoming.classList.add("is-on");
      outgoing.classList.remove("is-on");
      if (!outgoing.getAttribute("src")) outgoing.hidden = true;
      front = 1 - front;
    }

    function paint() {
      var snap = timeline.snapshot();
      var text = script.textFor(snap.scene);
      rootEl.dataset.scene = String(snap.scene);
      gate.hidden = snap.scene !== 0;
      muteBtn.hidden = snap.scene === 0;
      replayBtn.hidden = !snap.finished;
      muteBtn.setAttribute("aria-pressed", snap.muted ? "true" : "false");
      muteBtn.textContent = snap.muted ? "开声音" : "静音";
      showPicture(snap.scene);
      if (text !== lastText) {
        lastText = text;
        lineEl.textContent = text;
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
