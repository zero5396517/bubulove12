"use strict";

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.GiftPictures = api;
  }
})(typeof self !== "undefined" ? self : this, function () {
  var PICTURES = {
    1: { src: "assets/01-field.jpeg", animated: false },
    2: { src: "assets/02-bouquet.jpeg", animated: false },
    3: { src: "assets/03-outing.jpg", animated: false },
    4: { src: "assets/04-close.jpg", animated: false },
    5: { src: "assets/05-umbrella.gif", animated: true, still: "assets/05-umbrella-still.png" },
    6: { src: "assets/06-hug.gif", animated: true, still: "assets/06-hug-still.png" }
  };

  var cache = [];

  function pictureFor(scene) {
    return PICTURES[scene] || null;
  }

  // 换幕时再取图会空一拍。开场门还亮着时就把六张图和静帧取进缓存。
  function preload() {
    if (cache.length || typeof Image !== "function") return;
    var scene;
    for (scene in PICTURES) {
      if (!Object.prototype.hasOwnProperty.call(PICTURES, scene)) continue;
      keep(PICTURES[scene].src);
      if (PICTURES[scene].still) keep(PICTURES[scene].still);
    }
  }

  function keep(src) {
    var img = new Image();
    img.decoding = "async";
    img.src = src;
    cache.push(img);
    if (typeof img.decode === "function") {
      img.decode().catch(function () {
        /* 这张没解码成功，换幕时再试一次 */
      });
    }
  }

  return { pictureFor: pictureFor, preload: preload };
});
