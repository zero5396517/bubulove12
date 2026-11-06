"use strict";

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.GiftLines = api;
  }
})(typeof self !== "undefined" ? self : this, function () {
  var LINES = [
    "",
    "臭布布 和香一二是一对幸福的小熊熊",
    " 幸福的花儿为你盛开~~",
    " 有你的每天都很精彩~",
    " 亲爱的一二，我 喜欢你啊~",
    "愿你幸福永远，快乐永远~ ~",
    "莹酱，我爱你。"
  ];

  function textFor(scene) {
    if (scene === 7) return LINES[6];
    return LINES[scene] || "";
  }

  return { textFor: textFor };
});
