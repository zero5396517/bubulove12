"use strict";

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.GiftReveal = api;
  }
})(typeof self !== "undefined" ? self : this, function () {
  // 只回答每个字此刻淡到哪。汉字、标点、波浪号各占相等的一拍。
  function fade(text, elapsedMs, durationMs, reduceMotion) {
    var chars = String(text || "").split("");
    var n = chars.length;
    var out = new Array(n);
    var i;
    if (!n) return out;
    var elapsed = elapsedMs > 0 ? elapsedMs : 0;
    var showAll = Boolean(reduceMotion) || !(durationMs > 0) || elapsed >= durationMs;
    if (showAll) {
      for (i = 0; i < n; i += 1) out[i] = { char: chars[i], opacity: 1 };
      return out;
    }
    var beat = durationMs / n;
    for (i = 0; i < n; i += 1) {
      var start = beat * i;
      var opacity = 0;
      if (elapsed >= start + beat) opacity = 1;
      else if (elapsed > start) opacity = (elapsed - start) / beat;
      out[i] = { char: chars[i], opacity: opacity };
    }
    return out;
  }

  return { fade: fade };
});
