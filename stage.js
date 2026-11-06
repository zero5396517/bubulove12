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
    var roomEl = rootEl.parentElement;
    var timeline = options.timeline;
    var music = options.music;
    var pops = options.pops;
    var fireworks = options.fireworks;
    var script = options.script;
    var pictures = options.pictures;
    var lineEl = rootEl.querySelector("[data-line]");
    var gate = rootEl.querySelector("[data-gate]");
    var muteBtn = rootEl.querySelector("[data-mute]");
    var replayBtn = rootEl.querySelector("[data-replay]");
    var skyEl = rootEl.querySelector("[data-sky]");
    var layers = rootEl.querySelectorAll("[data-cast] img");
    var front = 0;
    var lastScene = null;
    var lastText = null;
    var nightRun = 0;
    var nightOrigin = null;
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
      if (pops) pops.setMuted(next);
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
      if (pops) pops.stop();
      nightOrigin = null;
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
      var picScene = scene === 7 ? 6 : scene;
      if (scene === lastScene) return;
      var prevPic = lastScene === 7 ? 6 : lastScene;
      lastScene = scene;
      if (picScene === prevPic) return;
      var pic = pictures.pictureFor(picScene);
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

    function nightMs(snap) {
      if (snap.scene !== 7) {
        nightOrigin = null;
        nightRun = snap.runId;
        return 0;
      }
      if (nightRun !== snap.runId || nightOrigin === null) {
        nightRun = snap.runId;
        if (snap.finished) {
          nightOrigin = "still";
          return 6000;
        }
        nightOrigin = Date.now();
        return 0;
      }
      if (nightOrigin === "still") return 6000;
      return Date.now() - nightOrigin;
    }

    function setSky(amount) {
      var value = String(amount);
      rootEl.style.setProperty("--sky", value);
      if (roomEl) roomEl.style.setProperty("--sky", value);
      document.documentElement.style.setProperty("--sky", value);
    }

    function drawSky(frame) {
      if (!skyEl || !frame) return;
      var ctx = skyEl.getContext("2d");
      if (!ctx) return;
      var dpr = window.devicePixelRatio || 1;
      var w = skyEl.clientWidth;
      var h = skyEl.clientHeight;
      if (!w || !h) return;
      var pixelW = Math.round(w * dpr);
      var pixelH = Math.round(h * dpr);
      if (skyEl.width !== pixelW || skyEl.height !== pixelH) {
        skyEl.width = pixelW;
        skyEl.height = pixelH;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      var sparks = frame.sparks || [];
      var i;
      for (i = 0; i < sparks.length; i += 1) {
        var s = sparks[i];
        var x = s.x * w;
        var y = s.y * h;
        var scale = s.kind === "burst" ? Math.max(Math.min(w, h), 340) : Math.min(w, h);
        var r = s.r * scale;
        var glow = s.kind === "burst" ? 4.4 : 3.1;
        ctx.globalAlpha = s.alpha * (s.kind === "burst" ? 0.5 : 0.42);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(x, y, r * glow, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    function clearSky() {
      if (!skyEl) return;
      var ctx = skyEl.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, skyEl.width, skyEl.height);
    }

    function paint() {
      var snap = timeline.snapshot();
      var text = script.textFor(snap.scene);
      var elapsed = nightMs(snap);
      var frame = null;
      if (snap.scene === 7 && fireworks) {
        frame = reduceMotion.matches ? fireworks.stillFrame() : fireworks.frameAt(elapsed);
      }
      rootEl.dataset.scene = String(snap.scene);
      gate.hidden = snap.scene !== 0;
      muteBtn.hidden = snap.scene === 0;
      replayBtn.hidden = !snap.finished;
      muteBtn.setAttribute("aria-pressed", snap.muted ? "true" : "false");
      muteBtn.textContent = snap.muted ? "开声音" : "静音";
      showPicture(snap.scene);
      setSky(frame ? frame.sky : 0);
      if (frame) drawSky(frame);
      else clearSky();
      if (pops) {
        pops.tick({
          runId: snap.runId,
          scene: snap.scene,
          finished: snap.finished,
          muted: snap.muted,
          bursting: frame ? frame.bursting : [],
          reduceMotion: reduceMotion.matches
        });
      }
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
