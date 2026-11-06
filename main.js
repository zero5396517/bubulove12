"use strict";

(function () {
  var theater = document.querySelector(".theater");
  var timeline = window.GiftTimeline.createTimeline();
  var music = window.GiftMusic.createMusicBox();
  window.GiftGate.attach({
    timeline: timeline,
    music: music,
    button: theater.querySelector("[data-gate]")
  });
  window.GiftStage.attach({
    timeline: timeline,
    music: music,
    script: window.GiftLines,
    root: theater
  });
})();
