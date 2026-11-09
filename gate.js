"use strict";

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.GiftGate = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  function attach(options) {
    var button = options.button;
    var opened = false;

    function open() {
      if (opened) return false;
      var snap = options.timeline.snapshot();
      if (snap.scene !== 0 || snap.playing || snap.finished) return false;
      if (!options.timeline.start()) return false;
      opened = true;
      try {
        options.music.start();
      } catch (err) {
        /* 音乐起不来时，话仍然往下说 */
      }
      if (options.pops && typeof options.pops.unlock === "function") {
        try {
          options.pops.unlock();
        } catch (err) {
          /* 轻响解不开时，夜空仍然会画 */
        }
      }
      button.hidden = true;
      return true;
    }

    button.addEventListener("click", open);
    return { open: open };
  }

  return { attach: attach };
});
