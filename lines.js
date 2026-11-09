"use strict";

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.GiftLines = api;
  }
})(typeof self !== "undefined" ? self : this, function () {
  // 画面上的空格都拿掉了。读不出录音时长时，逐字用这里的大约毫秒数。
  var LINES = [
    { text: "臭布布和香一二是一对幸福的小熊熊", voice: "vo/bubu_01.wav", fallbackMs: 3960 },
    { text: "幸福的花儿为你盛开~~", voice: "vo/bubu_line_01.wav", fallbackMs: 1800 },
    { text: "有你的每天都很精彩~", voice: "vo/bubu_line_02.wav", fallbackMs: 1810 },
    { text: "亲爱的一二，我喜欢你啊~", voice: "vo/bubu_line_03.wav", fallbackMs: 2400 },
    { text: "愿你幸福永远，快乐永远~~", voice: "vo/bubu_line_04.wav", fallbackMs: 2610 },
    { text: "莹酱，我爱你。", voice: "vo/bubu_03.wav", fallbackMs: 1380 }
  ];

  function indexFor(scene) {
    if (scene >= 1 && scene <= 5) return scene - 1;
    if (scene === 6) return 4;
    if (scene === 7) return 5;
    return -1;
  }

  function copyAt(index) {
    var line = LINES[index];
    if (!line) return null;
    return {
      index: index,
      text: line.text,
      voice: line.voice,
      fallbackMs: line.fallbackMs
    };
  }

  function textFor(scene) {
    var line = copyAt(indexFor(scene));
    return line ? line.text : "";
  }

  function lineFor(scene) {
    return copyAt(indexFor(scene));
  }

  return {
    textFor: textFor,
    lineFor: lineFor,
    lineAt: copyAt,
    count: LINES.length
  };
});
