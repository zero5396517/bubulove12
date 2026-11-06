"use strict";

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.GiftLines = api;
  }
})(typeof self !== "undefined" ? self : this, function () {
  var OPENING = "臭布布 和香一二是一对幸福的小熊熊";
  var ROSES = "";
  var ENTRANCE = " ";
  var LOVE = [
    " 幸福的花儿为你盛开~~",
    " 有你的每天都很精彩~",
    " 亲爱的一二，我 喜欢你啊~",
    "愿你幸福永远，快乐永远~ ~"
  ];
  var HOLD = "莹酱，我爱你。";

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
