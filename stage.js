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

    function rgba(hex, alpha) {
      var r = parseInt(hex.slice(1, 3), 16);
      var g = parseInt(hex.slice(3, 5), 16);
      var b = parseInt(hex.slice(5, 7), 16);
      return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
    }

    function drawOrb(ctx, x, y, radius, color, alpha) {
      var glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, rgba(color, Math.min(1, alpha)));
      glow.addColorStop(0.28, rgba(color, alpha * 0.55));
      glow.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
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
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      var sparks = frame.sparks || [];
      var minSide = Math.min(w, h);
      var i;
      var p;
      for (i = 0; i < sparks.length; i += 1) {
        var s = sparks[i];
        var x = s.x * w;
        var y = s.y * h;
        var isBurst = s.kind === "burst" || s.kind === "trace";
        var scale = isBurst ? Math.max(minSide, 340) : minSide;
        var r = s.r * scale;
        var trail = s.trail;
        if (trail && trail.length > 1) {
          ctx.strokeStyle = rgba(s.color, s.alpha * 0.85);
          ctx.lineWidth = Math.max(1.1, r * (s.kind === "trace" ? 0.7 : 1.15));
          ctx.beginPath();
          ctx.moveTo(trail[0].x * w, trail[0].y * h);
          for (p = 1; p < trail.length; p += 1) {
            ctx.lineTo(trail[p].x * w, trail[p].y * h);
          }
          ctx.stroke();
        }
        drawOrb(ctx, x, y, r * (isBurst ? 3.6 : 2.8), s.color, s.alpha);
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
