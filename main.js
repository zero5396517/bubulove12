"use strict";

(function () {
  var theater = document.querySelector(".theater");
  var timeline = window.GiftTimeline.createTimeline();
  var music = window.GiftMusic.createMusic({
    element: document.querySelector("[data-music]")
  });
  var pops = window.GiftPops.createPops({
    element: document.querySelector("[data-pops]")
  });
  window.GiftGate.attach({
    timeline: timeline,
    music: music,
    pops: pops,
    button: theater.querySelector("[data-gate]")
  });
  window.GiftStage.attach({
    timeline: timeline,
    music: music,
    pops: pops,
    fireworks: window.GiftFireworks,
    script: window.GiftLines,
    pictures: window.GiftPictures,
    root: theater
  });
})();
