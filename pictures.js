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

  function pictureFor(scene) {
    return PICTURES[scene] || null;
  }

  return { pictureFor: pictureFor };
});
