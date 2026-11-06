"use strict";

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.GiftLines = api;
  }
})(typeof self !== "undefined" ? self : this, function () {
  var OPENING = "莹酱，今天不谈别的，只把心里的话说给你。";
  var ROSES = "先让花开一会儿。";
  var ENTRANCE = "一二，我穿过很多天，才走到你面前。";
  var LOVE = [
    "喜欢你，是我做过最安静、也最确定的事。",
    "世界再大，我也只要与你并肩的那一条路。",
    "若岁月允许，我想把余生都交给你。"
  ];
  var HOLD = "莹酱，这就是布布对一二说的。也是我对你说的。我爱你。";

  function textFor(scene, lineIndex) {
    if (scene === 1) return OPENING;
    if (scene === 2) return ROSES;
    if (scene === 3) return ENTRANCE;
    if (scene === 4) {
      var index = lineIndex == null ? 0 : lineIndex;
      return LOVE[index] || "";
    }
    if (scene === 5) return HOLD;
    return "";
  }

  return { textFor: textFor };
});
