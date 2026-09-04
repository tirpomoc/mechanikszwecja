
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

      header.classList.toggle(
        'scrolled',
        window.scrollY > 18
      );

    }

  },
  {
    passive: true
  }
);


/* =========================================
   MENU MOBILNE
========================================== */

menuButton?.addEventListener(
  'click',
  () => {

    const isOpen =
      menuButton.getAttribute(
        'aria-expanded'
      ) === 'true';


    menuButton.setAttribute(
      'aria-expanded',
      String(!isOpen)
    );


    nav?.classList.toggle(
      'open',
      !isOpen
    );

  }
);


document
  .querySelectorAll('.main-nav a')
  .forEach((link) => {

    link.addEventListener(
      'click',
      () => {

        nav?.classList.remove(
          'open'
        );


        menuButton?.setAttribute(
          'aria-expanded',
          'false'
        );

      }
    );

  });


/* =========================================
   ANIMACJE ELEMENTÓW
========================================== */

const observer =
  new IntersectionObserver(

    (entries) => {

      entries.forEach(
        (entry) => {

          if (
            entry.isIntersecting
          ) {

            entry.target
              .classList
              .add('visible');


            observer.unobserve(
              entry.target
            );

          }

        }
      );

    },

    {
      threshold: 0.12
    }

  );


document
  .querySelectorAll('.reveal')
  .forEach((element) => {

    observer.observe(
      element
    );

  });


/* =========================================
   ROK W STOPCE
========================================== */

const year =
  document.getElementById(
    'year'
  );


if (year) {

  year.textContent =
    new Date()
      .getFullYear();

}


/* =========================================
   KOPIOWANIE NUMERU TELEFONU

   Kliknięcie numeru:
   - kopiuje numer
   - pokazuje komunikat

   Dolny przycisk:
   "ZADZWOŃ"
   nadal wykonuje połączenie.
========================================== */

let phoneToastTimer;


function getPhoneToast() {

  let toast =
    document.querySelector(
      '.copy-phone-toast'
    );


  if (!toast) {

    toast =
      document.createElement(
        'div'
      );


    toast.className =
      'copy-phone-toast';


    toast.setAttribute(
      'role',
      'status'
    );


    toast.setAttribute(
      'aria-live',
      'polite'
    );


    document.body.appendChild(
      toast
    );

  }


  return toast;

}


function showPhoneToast(phone) {

  const toast =
    getPhoneToast();


  toast.innerHTML =
    `<strong>Skopiowano:</strong> ${phone}`;


  toast.classList.add(
    'is-visible'
  );


  window.clearTimeout(
    phoneToastTimer
  );


  phoneToastTimer =
    window.setTimeout(
      () => {

        toast.classList.remove(
          'is-visible'
        );

      },
      2200
    );

}


function fallbackCopy(text) {

  const textarea =
    document.createElement(
      'textarea'
    );


  textarea.value =
    text;


  textarea.setAttribute(
    'readonly',
    ''
  );


  textarea.style.position =
    'fixed';


  textarea.style.left =
    '-9999px';


  textarea.style.opacity =
    '0';


  document.body.appendChild(
    textarea
  );


  textarea.select();


  document.execCommand(
    'copy'
  );


  textarea.remove();

}


document
  .querySelectorAll(
    'a[href^="tel:"]:not(.mobile-call)'
  )
  .forEach((link) => {

    link.addEventListener(
      'click',
      async (event) => {

        event.preventDefault();


        const rawPhone =
          link
            .getAttribute(
              'href'
            )
            ?.replace(
              /^tel:/,
              ''
            )
            .trim()
          ||
          '+48660845125';


        const strong =
          link.querySelector(
            'strong'
          );


        let displayedPhone =
          strong
            ?.textContent
            ?.trim();


        if (
          !displayedPhone ||
          !displayedPhone.includes('+')
        ) {

          const text =
            link
              .textContent
              .replace(
                /\s+/g,
                ' '
              )
              .trim();


          const phoneMatch =
            text.match(
              /\+\d[\d\s-]{6,}/
            );


          displayedPhone =
            phoneMatch
              ? phoneMatch[0].trim()
              : '+48 660 845 125';

        }


        try {

          if (
            navigator.clipboard &&
            window.isSecureContext
          ) {

            await navigator
              .clipboard
              .writeText(
                rawPhone
              );

          } else {

            fallbackCopy(
              rawPhone
            );

          }


          showPhoneToast(
            displayedPhone
          );

        } catch (error) {

          fallbackCopy(
            rawPhone
          );


          showPhoneToast(
            displayedPhone
          );

        }

      }
    );

  });


/* =========================================
   FILM YOUTUBE
========================================== */

document
  .querySelectorAll(
    '.video-player[data-video-id]'
  )
  .forEach((player) => {

    const videoId =
      player.dataset
        .videoId
        ?.trim();


    const button =
      player.querySelector(
        '.video-facade'
      );


    const thumbnail =
      player.querySelector(
        '.video-thumbnail'
      );


    const hasVideo =
      videoId &&
      videoId !==
        'TU_WSTAW_ID_FILMU_Z_YOUTUBE';


    /* =====================================
       MINIATURA
    ====================================== */

    if (
      thumbnail &&
      hasVideo
    ) {

      let fallbackUsed =
        false;


      thumbnail.src =
        `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;


      thumbnail.addEventListener(
        'load',
        () => {

          thumbnail
            .classList
            .add(
              'is-loaded'
            );

        }
      );


      thumbnail.addEventListener(
        'error',
        () => {

          if (fallbackUsed) {
            return;
          }


          fallbackUsed =
            true;


          thumbnail.src =
            `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        }
      );

    }


    /* =====================================
       YOUTUBE PO KLIKNIĘCIU
    ====================================== */

    button?.addEventListener(
      'click',
      () => {

        if (!hasVideo) {

          console.warn(
            'Wstaw ID filmu YouTube w data-video-id w pliku index.html.'
          );

          return;

        }


        const iframe =
          document.createElement(
            'iframe'
          );


        iframe.src =
          `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;


        iframe.title =
          'Film o serwisie Polski Mechanik w Szwecji';


        iframe.allow =
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';


        iframe.allowFullscreen =
          true;


        iframe.referrerPolicy =
          'strict-origin-when-cross-origin';


        player.replaceChildren(
          iframe
        );

      }
    );

  });




