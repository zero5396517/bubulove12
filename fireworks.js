"use strict";

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.GiftFireworks = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  var DARK_MS = 1000;
  var HEART_AT = 4000;
  var LOCK_MS = 6000;
  var BURST_MS = 500;
  var ROCKET_MS = 180;
  var STEP_MS = 16;
  var TRAIL = 5;
  var FRICTION = 0.9;
  var GRAVITY = 0.00055;
  var PINK = "#f4b4c0";
  var CREAM = "#f7ead4";
  var GOLD = "#e8c57a";
  var COLORS = [PINK, CREAM, GOLD];

  var BURSTS = [
    { x: 0.26, y: 0.26, at: 1000, tint: 0 },
    { x: 0.74, y: 0.22, at: 1800, tint: 1 },
    { x: 0.48, y: 0.18, at: 2600, tint: 2 },
    { x: 0.62, y: 0.34, at: 3400, tint: 0 }
  ];

  var YING_BOX = { x: 0.205, y: 0.28, w: 0.265, h: 0.30 };
  var JIANG_BOX = { x: 0.53, y: 0.28, w: 0.265, h: 0.30 };

  var YING_STROKES = [
    [[0.28, 0.00], [0.28, 0.22]],
    [[0.72, 0.00], [0.72, 0.22]],
    [[0.08, 0.12], [0.92, 0.12]],
    [[0.16, 0.28], [0.16, 0.42]],
    [[0.16, 0.30], [0.84, 0.30], [0.84, 0.46], [0.74, 0.48]],
    [[0.24, 0.54], [0.76, 0.54]],
    [[0.50, 0.54], [0.50, 0.94]],
    [[0.24, 0.72], [0.76, 0.72]],
    [[0.18, 0.94], [0.82, 0.94]],
    [[0.64, 0.80], [0.82, 0.90]]
  ];

  var JIANG_STROKES = [
    [[0.06, 0.02], [0.16, 0.10]],
    [[0.14, 0.10], [0.14, 0.44]],
    [[0.04, 0.36], [0.26, 0.26]],
    [[0.52, 0.02], [0.38, 0.34]],
    [[0.42, 0.10], [0.92, 0.10]],
    [[0.80, 0.10], [0.62, 0.36]],
    [[0.80, 0.18], [0.94, 0.30]],
    [[0.16, 0.48], [0.92, 0.48]],
    [[0.22, 0.48], [0.22, 0.96]],
    [[0.86, 0.48], [0.86, 0.96]],
    [[0.22, 0.96], [0.86, 0.96]],
    [[0.22, 0.72], [0.86, 0.72]],
    [[0.38, 0.58], [0.70, 0.58]],
    [[0.38, 0.58], [0.38, 0.84]],
    [[0.70, 0.58], [0.70, 0.84]],
    [[0.38, 0.84], [0.70, 0.84]]
  ];

  function clamp01(n) {
    if (n < 0) return 0;
    if (n > 1) return 1;
    return n;
  }

  function mix(a, b, t) {
    return a + (b - a) * t;
  }

  function hash(i, j) {
    var n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
    return n - Math.floor(n);
  }

  function heartPoint(t) {
    var x = 16 * Math.pow(Math.sin(t), 3);
    var y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return {
      x: 0.5 + x * 0.0215,
      y: 0.46 - y * 0.0155
    };
  }

  function spark(x, y, color, r, alpha, kind, trail) {
    return {
      x: x,
      y: y,
      color: color,
      r: r,
      alpha: alpha,
      kind: kind || "heart",
      trail: trail || null
    };
  }

  function colorAt(i) {
    return COLORS[i % COLORS.length];
  }

  function trailFrom(x, y, vx, vy, friction, gravity, steps, length) {
    var pts = [];
    var px = x;
    var py = y;
    var sx = vx;
    var sy = vy;
    var n = steps < 0 ? 0 : steps;
    var i;
    for (i = 0; i <= n; i += 1) {
      if (i >= n - length) pts.push({ x: px, y: py });
      sx *= friction;
      sy = sy * friction + gravity;
      px += sx;
      py += sy;
    }
    return { x: px, y: py, trail: pts };
  }

  function rocketSparks(burst, index, t) {
    var start = burst.at - ROCKET_MS;
    var age = t - start;
    if (age < 0 || age > ROCKET_MS) return [];
    var life = age / ROCKET_MS;
    var ease = 1 - Math.pow(1 - life, 2.1);
    var x0 = burst.x + (hash(index, 9) - 0.5) * 0.012;
    var y0 = burst.y + 0.2;
    var x = mix(x0, burst.x, ease);
    var y = mix(y0, burst.y, ease);
    var prev = mix(0, ease, 0.55);
    var trail = [
      { x: mix(x0, burst.x, Math.max(0, ease - 0.22)), y: mix(y0, burst.y, Math.max(0, ease - 0.22)) },
      { x: mix(x0, burst.x, prev), y: mix(y0, burst.y, prev) },
      { x: x, y: y }
    ];
    return [
      spark(x, y, CREAM, 0.01, 0.95, "trace", trail),
      spark(x, y, colorAt(burst.tint), 0.006, 0.85, "trace", trail)
    ];
  }

  function burstSparks(burst, index, age) {
    var life = clamp01(age / BURST_MS);
    if (age < 0 || life >= 1) return [];
    var out = [];
    var flash = life < 0.16 ? 1 - life / 0.16 : 0;
    if (flash > 0) {
      out.push(spark(burst.x, burst.y, CREAM, mix(0.07, 0.018, life), flash, "burst"));
      out.push(spark(burst.x, burst.y, colorAt(burst.tint), mix(0.04, 0.012, life), flash * 0.9, "burst"));
    }
    var steps = Math.floor(age / STEP_MS);
    var layers = [
      { count: 56, speed: 0.018, size: 0.0075 },
      { count: 28, speed: 0.011, size: 0.0055 }
    ];
    var layer;
    var i;
    for (layer = 0; layer < layers.length; layer += 1) {
      var spec = layers[layer];
      for (i = 0; i < spec.count; i += 1) {
        var seed = index * 97 + layer * 31 + i;
        var angle = (i / spec.count) * Math.PI * 2 + hash(seed, 1) * 0.32;
        var speed = spec.speed + hash(seed, 2) * spec.speed * 0.45;
        var vx = Math.cos(angle) * speed;
        var vy = Math.sin(angle) * speed - 0.002;
        var pos = trailFrom(burst.x, burst.y, vx, vy, FRICTION, GRAVITY, steps, TRAIL);
        var fade = life < 0.12 ? life / 0.12 : 1 - (life - 0.12) / 0.88;
        var flick = 0.72 + 0.28 * hash(seed, steps);
        out.push(spark(
          pos.x,
          pos.y,
          colorAt(burst.tint + layer + i),
          spec.size * mix(1.15, 0.55, life),
          fade * flick,
          "burst",
          pos.trail
        ));
      }
    }
    return out;
  }

  function samplePolyline(points, spacing) {
    var out = [];
    if (!points.length) return out;
    var remain = 0;
    var i;
    out.push({ x: points[0][0], y: points[0][1] });
    for (i = 1; i < points.length; i += 1) {
      var x0 = points[i - 1][0];
      var y0 = points[i - 1][1];
      var x1 = points[i][0];
      var y1 = points[i][1];
      var dx = x1 - x0;
      var dy = y1 - y0;
      var seg = Math.sqrt(dx * dx + dy * dy);
      if (seg === 0) continue;
      var pos = remain;
      while (pos <= seg) {
        var t = pos / seg;
        out.push({ x: x0 + dx * t, y: y0 + dy * t });
        pos += spacing;
      }
      remain = pos - seg;
    }
    return out;
  }

  function mapBox(pt, box) {
    return {
      x: box.x + pt.x * box.w,
      y: box.y + pt.y * box.h
    };
  }

  var HEART_DOTS = (function () {
    var dots = [];
    var n = 110;
    var i;
    for (i = 0; i < n; i += 1) {
      dots.push(heartPoint((i / n) * Math.PI * 2));
    }
    return dots;
  })();

  var NAME_DOTS = (function () {
    var dots = [];
    function addChar(strokes, box, tint) {
      var s;
      for (s = 0; s < strokes.length; s += 1) {
        var pts = samplePolyline(strokes[s], 0.038);
        var i;
        for (i = 0; i < pts.length; i += 1) {
          var mapped = mapBox(pts[i], box);
          dots.push({
            x: mapped.x,
            y: mapped.y,
            color: colorAt(tint + s + i)
          });
        }
      }
    }
    addChar(YING_STROKES, YING_BOX, 0);
    addChar(JIANG_STROKES, JIANG_BOX, 1);
    return dots;
  })();

  function gatherDot(target, index, form, locked, t, kind) {
    var cx = 0.5;
    var cy = 0.46;
    var fromX = target.x + (target.x - cx) * 0.7;
    var fromY = target.y + (target.y - cy) * 0.7;
    var ease = locked ? 1 : 1 - Math.pow(1 - form, 2.4);
    var x = mix(fromX, target.x, ease);
    var y = mix(fromY, target.y, ease);
    var trail = null;
    if (!locked && form > 0 && form < 1) {
      var e0 = 1 - Math.pow(1 - Math.max(0, form - 0.1), 2.4);
      var e1 = 1 - Math.pow(1 - Math.max(0, form - 0.05), 2.4);
      trail = [
        { x: mix(fromX, target.x, e0), y: mix(fromY, target.y, e0) },
        { x: mix(fromX, target.x, e1), y: mix(fromY, target.y, e1) },
        { x: x, y: y }
      ];
    }
    var flick = locked ? 0.9 + 0.1 * Math.sin(t / 220 + index) : mix(0.55, 0.96, form);
    return spark(
      x,
      y,
      target.color || colorAt(index),
      kind === "name" ? 0.0064 : 0.0078,
      flick,
      kind,
      trail
    );
  }

  function gather(ms, options) {
    var t = ms < 0 ? 0 : ms;
    var locked = t >= LOCK_MS;
    var still = options && options.still;
    var sky = clamp01(t / DARK_MS);
    var form = clamp01((t - HEART_AT) / (LOCK_MS - HEART_AT));
    var bursting = [];
    var sparks = [];
    var allowBursts = !still;
    var allowEmbers = locked && !still;
    var i;

    if (allowBursts && !locked) {
      for (i = 0; i < BURSTS.length; i += 1) {
        sparks = sparks.concat(rocketSparks(BURSTS[i], i, t));
        var age = t - BURSTS[i].at;
        if (age >= 0 && age < BURST_MS) {
          bursting.push(i);
          sparks = sparks.concat(burstSparks(BURSTS[i], i, age));
        }
      }
    }

    if (form > 0) {
      var heartCount = still || locked ? HEART_DOTS.length : Math.max(1, Math.ceil(HEART_DOTS.length * form));
      for (i = 0; i < heartCount; i += 1) {
        sparks.push(gatherDot(HEART_DOTS[i], i, form, locked || still, t, "heart"));
      }
      var nameCount = still || locked ? NAME_DOTS.length : Math.max(1, Math.ceil(NAME_DOTS.length * form));
      for (i = 0; i < nameCount; i += 1) {
        sparks.push(gatherDot(NAME_DOTS[i], i + 3, form, locked || still, t, "name"));
      }
    }

    if (allowEmbers) {
      for (i = 0; i < 10; i += 1) {
        var base = HEART_DOTS[(i * 11) % HEART_DOTS.length];
        var wobble = Math.sin((t + i * 240) / 900);
        sparks.push(spark(
          base.x + 0.008 * wobble,
          base.y + 0.006 * Math.cos((t + i * 180) / 1100),
          colorAt(i + 1),
          0.0042,
          0.18 + 0.2 * (0.5 + 0.5 * Math.sin((t + i * 370) / 420)),
          "ember"
        ));
      }
    }

    return {
      sky: sky,
      bursting: bursting,
      heart: form,
      name: form,
      locked: locked,
      embers: allowEmbers,
      sparks: sparks
    };
  }

  function frameAt(ms) {
    return gather(ms, { still: false });
  }

  function stillFrame() {
    var frame = gather(LOCK_MS, { still: true });
    frame.locked = true;
    frame.embers = false;
    frame.bursting = [];
    return frame;
  }

  return {
    frameAt: frameAt,
    stillFrame: stillFrame,
    bursts: BURSTS
  };
});
