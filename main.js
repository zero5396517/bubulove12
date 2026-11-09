"use strict";

(function () {
  var theater = document.querySelector(".theater");
  window.GiftPictures.preload();
  var timeline = window.GiftTimeline.createTimeline();
  var music = window.GiftMusic.createMusic({
    element: document.querySelector("[data-music]")
  });
  var pops = window.GiftPops.createPops({
    element: document.querySelector("[data-pops]")
  });
  var voices = window.GiftVoices.createVoices({
    script: window.GiftLines,
    music: music
  });
  window.GiftGate.attach({
    timeline: timeline,
    music: music,
    pops: pops,
    voices: voices,
    button: theater.querySelector("[data-gate]")
  });
  window.GiftStage.attach({
    timeline: timeline,
    music: music,
    pops: pops,
    voices: voices,
    reveal: window.GiftReveal,
    fireworks: window.GiftFireworks,
    script: window.GiftLines,
    pictures: window.GiftPictures,
    root: theater
  });
})();
