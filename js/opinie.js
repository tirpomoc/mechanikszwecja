(function () {

  const shots = Array.from(
    document.querySelectorAll(".reviews-shot")
  );

  const lightbox =
    document.getElementById("reviews-lightbox");

  if (!shots.length || !lightbox) {
    return;
  }

  const image =
    lightbox.querySelector(".reviews-lightbox-image");

  const closeButton =
    lightbox.querySelector(".reviews-lightbox-close");

  const prevButton =
    lightbox.querySelector(".reviews-lightbox-prev");

  const nextButton =
    lightbox.querySelector(".reviews-lightbox-next");

  const currentCounter =
    lightbox.querySelector(".reviews-current");

  const totalCounter =
    lightbox.querySelector(".reviews-total");


  const reviews = shots.map((shot) => {

    const img = shot.querySelector("img");

    return {
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt") || "Opinia klienta"
    };

  });


  let currentIndex = 0;

  let touchStartX = 0;
  let touchEndX = 0;


  totalCounter.textContent =
    reviews.length;


  function showReview(index) {

    if (index < 0) {
      index = reviews.length - 1;
    }

    if (index >= reviews.length) {
      index = 0;
    }

    currentIndex = index;

    image.style.animation = "none";

    void image.offsetWidth;

    image.style.animation = "";

    image.src =
      reviews[currentIndex].src;

    image.alt =
      reviews[currentIndex].alt;

    currentCounter.textContent =
      currentIndex + 1;

  }


  function openLightbox(index) {

    showReview(index);

    lightbox.hidden = false;

    document.body.classList.add(
      "reviews-lightbox-open"
    );

    closeButton.focus();

  }


  function closeLightbox() {

    lightbox.hidden = true;

    document.body.classList.remove(
      "reviews-lightbox-open"
    );

    shots[currentIndex]?.focus();

  }


  function nextReview() {

    showReview(currentIndex + 1);

  }


  function previousReview() {

    showReview(currentIndex - 1);

  }


  shots.forEach((shot, index) => {

    shot.addEventListener("click", function () {

      openLightbox(index);

    });

  });


  closeButton.addEventListener(
    "click",
    closeLightbox
  );


  nextButton.addEventListener(
    "click",
    nextReview
  );


  prevButton.addEventListener(
    "click",
    previousReview
  );


  lightbox.addEventListener(
    "click",
    function (event) {

      if (event.target === lightbox) {
        closeLightbox();
      }

    }
  );


  document.addEventListener(
    "keydown",
    function (event) {

      if (lightbox.hidden) {
        return;
      }

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowRight") {
        nextReview();
      }

      if (event.key === "ArrowLeft") {
        previousReview();
      }

    }
  );


  lightbox.addEventListener(
    "touchstart",
    function (event) {

      touchStartX =
        event.changedTouches[0].screenX;

    },
    {
      passive: true
    }
  );


  lightbox.addEventListener(
    "touchend",
    function (event) {

      touchEndX =
        event.changedTouches[0].screenX;

      const distance =
        touchEndX - touchStartX;

      if (Math.abs(distance) < 45) {
        return;
      }

      if (distance < 0) {
        nextReview();
      } else {
        previousReview();
      }

    },
    {
      passive: true
    }
  );

})();