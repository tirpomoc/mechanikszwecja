const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');


/* =========================================
   HEADER PO PRZEWINIĘCIU
========================================== */

window.addEventListener(
  'scroll',
  () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 18);
    }
  },
  { passive: true }
);


/* =========================================
   MENU MOBILNE
========================================== */

menuButton?.addEventListener('click', () => {

  const isOpen =
    menuButton.getAttribute('aria-expanded') === 'true';

  menuButton.setAttribute(
    'aria-expanded',
    String(!isOpen)
  );

  nav?.classList.toggle('open', !isOpen);

});


document.querySelectorAll('.main-nav a').forEach((link) => {

  link.addEventListener('click', () => {

    nav?.classList.remove('open');

    menuButton?.setAttribute(
      'aria-expanded',
      'false'
    );

  });

});


/* =========================================
   ANIMACJE ELEMENTÓW
========================================== */

const observer = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.classList.add('visible');

        observer.unobserve(entry.target);

      }

    });

  },
  {
    threshold: 0.12
  }
);


document.querySelectorAll('.reveal').forEach((element) => {

  observer.observe(element);

});


/* =========================================
   ROK W STOPCE
========================================== */

const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}


/* =========================================
   KRAJE I MIASTA
   Kliknięcie kafelka rozwija listę miast
========================================== */

const countryButtons =
  document.querySelectorAll('[data-country-target]');

const countryPanels =
  document.querySelectorAll('[data-country-panel]');


countryButtons.forEach((button) => {

  button.addEventListener('click', () => {

    const target =
      button.dataset.countryTarget;

    const panel =
      document.querySelector(
        `[data-country-panel="${target}"]`
      );

    if (!panel) {
      return;
    }

    const isOpen =
      button.getAttribute('aria-expanded') === 'true';


    /* Zamykamy pozostałe kraje */

    countryButtons.forEach((otherButton) => {

      otherButton.setAttribute(
        'aria-expanded',
        'false'
      );

      otherButton.classList.remove('is-active');

    });


    countryPanels.forEach((otherPanel) => {

      otherPanel.hidden = true;
      otherPanel.classList.remove('is-open');

    });


    /* Ponowne kliknięcie zamyka aktualny kraj */

    if (isOpen) {
      return;
    }


    /* Otwieramy wybrany kraj */

    button.setAttribute(
      'aria-expanded',
      'true'
    );

    button.classList.add('is-active');

    panel.hidden = false;

    requestAnimationFrame(() => {
      panel.classList.add('is-open');
    });

  });

});


/* =========================================
   FILM
   YouTube ładuje się dopiero po kliknięciu PLAY
========================================== */

document
  .querySelectorAll('.video-player[data-video-id]')
  .forEach((player) => {

    const videoId =
      player.dataset.videoId?.trim();

    const button =
      player.querySelector('.video-facade');

    const thumbnail =
      player.querySelector('.video-thumbnail');


    const hasVideo =
      videoId &&
      videoId !== 'TU_WSTAW_ID_FILMU_Z_YOUTUBE';


    /* -----------------------------------------
       LEKKA MINIATURA FILMU
       Ładuje się tylko obrazek, nie YouTube
    ------------------------------------------ */

    if (thumbnail && hasVideo) {

      let fallbackUsed = false;

      thumbnail.src =
        `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

      thumbnail.addEventListener('load', () => {

        thumbnail.classList.add('is-loaded');

      });


      thumbnail.addEventListener('error', () => {

        if (fallbackUsed) {
          return;
        }

        fallbackUsed = true;

        thumbnail.src =
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      });

    }


    /* -----------------------------------------
       YOUTUBE DOPIERO PO KLIKNIĘCIU
    ------------------------------------------ */

    button?.addEventListener('click', () => {

      if (!hasVideo) {

        console.warn(
          'Wstaw ID filmu YouTube w data-video-id w pliku index.html.'
        );

        return;

      }


      const iframe =
        document.createElement('iframe');


      iframe.src =
        `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;


      iframe.title =
        'Film o serwisie Polski Mechanik w Szwecji';


      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';


      iframe.allowFullscreen = true;


      iframe.referrerPolicy =
        'strict-origin-when-cross-origin';


      player.replaceChildren(iframe);

    });

  });