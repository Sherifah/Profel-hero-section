(function () {
  var loaderNum = document.getElementById("loaderNum");
  var loaderLine = document.getElementById("loaderLine");
  var pageLoader = document.getElementById("pageLoader");
  var names = document.querySelector(".names");

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var COUNT_DURATION = reducedMotion ? 0 : 1800;
  var HOLD_AT_100 = 250;

  var SETTLE_AFTER = 1950; // last tag's stagger delay (1380ms) + its transition (500ms) + buffer

  function reveal() {
    names.classList.add("revealed");
    setTimeout(function () {
      names.classList.add("settled");
    }, reducedMotion ? 0 : SETTLE_AFTER);
  }

  function slideOut() {
    if (reducedMotion) {
      pageLoader.remove();
      reveal();
      return;
    }
    pageLoader.addEventListener("transitionend", function onEnd(e) {
      if (e.propertyName !== "transform") return;
      pageLoader.removeEventListener("transitionend", onEnd);
      pageLoader.remove();
    });
    pageLoader.classList.add("slide-out");
    reveal();
  }

  function tick(startTime, now) {
    var elapsed = now - startTime;
    var progress = Math.min(elapsed / COUNT_DURATION, 1);
    var value = Math.round(progress * 100);

    loaderNum.textContent = value;
    loaderLine.style.width = value + "%";

    if (progress < 1) {
      requestAnimationFrame(function (t) { tick(startTime, t); });
    } else {
      setTimeout(slideOut, HOLD_AT_100);
    }
  }

  if (reducedMotion) {
    loaderNum.textContent = 100;
    loaderLine.style.width = "100%";
    setTimeout(slideOut, HOLD_AT_100);
  } else {
    requestAnimationFrame(function (t) { tick(t, t); });
  }

  document.querySelectorAll(".name-photo").forEach(function (photo) {
    var direction = Math.random() < 0.5 ? -1 : 1; // left (-1) or right (1)
    var angle = direction * (6 + Math.random() * 8); // 6-14deg magnitude
    var shift = direction * (2 + Math.random() * 1.2); // 2-3.2vw magnitude, same side as tilt

    photo.style.setProperty("--tilt", angle.toFixed(2) + "deg");
    photo.style.setProperty("--shift", shift.toFixed(2) + "vw");
  });
})();
