
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


/* MECHANIK_SZWECJA_FIX_01
   Linki tel: korzystają z normalnej obsługi telefonu.
   Nie przechwytujemy ich kliknięć.
*/

const galleryItems=[
{src:'/assets/images/pierwsze.webp',alt:'Polski mechanik mobilnego serwisu TIR w Szwecji',width:900,height:1194},
{src:'/assets/images/drugie.webp',alt:'Narzędzia i wyposażenie mobilnego serwisu',width:1200,height:904},
{src:'/assets/images/trzecie.webp',alt:'Wyposażenie mobilnego serwisu przewożone w samochodzie',width:1200,height:1594}
];
document.querySelectorAll('[data-photo-gallery]').forEach(g=>{
const im=g.querySelector('[data-gallery-image]'),pr=g.querySelector('[data-gallery-prev]'),nx=g.querySelector('[data-gallery-next]'),lb=g.querySelector('[data-gallery-lightbox]'),li=g.querySelector('[data-gallery-lightbox-image]'),cl=g.querySelectorAll('[data-gallery-close]');
if(!im||!pr||!nx||!lb||!li)return;let x=0,busy=false;
const buttons=()=>{pr.hidden=x===0;nx.hidden=x===galleryItems.length-1};
const light=()=>{const a=galleryItems[x];li.src=a.src;li.alt=a.alt;li.width=a.width;li.height=a.height};
const open=()=>{light();lb.hidden=false;lb.setAttribute('aria-hidden','false');document.body.classList.add('gallery-open')};
const close=()=>{lb.hidden=true;lb.setAttribute('aria-hidden','true');document.body.classList.remove('gallery-open');im.focus({preventScroll:true})};
const show=async n=>{if(busy||n<0||n>=galleryItems.length||n===x)return;busy=true;pr.disabled=nx.disabled=true;const a=galleryItems[n],z=new Image();z.decoding='async';z.src=a.src;try{if(z.decode)await z.decode();else await new Promise((ok,no)=>{z.onload=ok;z.onerror=no})}catch(e){}im.src=a.src;im.alt=a.alt;im.width=a.width;im.height=a.height;x=n;busy=false;pr.disabled=nx.disabled=false;buttons()};
pr.onclick=()=>show(x-1);nx.onclick=()=>show(x+1);im.onclick=open;im.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}};cl.forEach(q=>q.onclick=close);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!lb.hidden)close()});buttons();
});


/* FULLSCREEN PHOTO SCRIPT START */

(() => {

  const galleryImage =
    document.querySelector(
      '[data-gallery-image]'
    );


  if (!galleryImage) {
    return;
  }


  /*
    Tworzymy fullscreen bezpośrednio w BODY.
    Dzięki temu żadna sekcja, transformacja ani
    content-visibility nie może ograniczyć jego rozmiaru.
  */

  const overlay =
    document.createElement(
      'div'
    );


  overlay.className =
    'photo-fullscreen-overlay';


  overlay.hidden =
    true;


  overlay.setAttribute(
    'aria-hidden',
    'true'
  );


  overlay.innerHTML = `
    <button
      class="photo-fullscreen-backdrop"
      type="button"
      aria-label="Zamknij powiększone zdjęcie"
    ></button>

    <div
      class="photo-fullscreen-content"
      role="dialog"
      aria-modal="true"
      aria-label="Powiększone zdjęcie"
    >

      <img
        class="photo-fullscreen-image"
        alt=""
        decoding="async"
      >

    </div>

    <button
      class="photo-fullscreen-close"
      type="button"
      aria-label="Zamknij zdjęcie"
    >
      ×
    </button>
  `;


  document.body.appendChild(
    overlay
  );


  const fullscreenImage =
    overlay.querySelector(
      '.photo-fullscreen-image'
    );


  const backdrop =
    overlay.querySelector(
      '.photo-fullscreen-backdrop'
    );


  const closeButton =
    overlay.querySelector(
      '.photo-fullscreen-close'
    );


  const openFullscreen = () => {

    /*
      Bierzemy AKTUALNE zdjęcie z galerii,
      więc działa dla pierwszego, drugiego
      i trzeciego zdjęcia.
    */

    fullscreenImage.src =
      galleryImage.currentSrc ||
      galleryImage.src;


    fullscreenImage.alt =
      galleryImage.alt || '';


    overlay.hidden =
      false;


    overlay.setAttribute(
      'aria-hidden',
      'false'
    );


    document.body
      .classList
      .add(
        'photo-fullscreen-open'
      );


    closeButton.focus();

  };


  const closeFullscreen = () => {

    overlay.hidden =
      true;


    overlay.setAttribute(
      'aria-hidden',
      'true'
    );


    document.body
      .classList
      .remove(
        'photo-fullscreen-open'
      );

  };


  /*
    Capture = true:
    przechwytujemy kliknięcie wcześniej niż
    starszy kod lightboxa, żeby nie otworzyły
    się dwie warstwy jednocześnie.
  */

  galleryImage.addEventListener(
    'click',
    (event) => {

      event.preventDefault();
      event.stopImmediatePropagation();

      openFullscreen();

    },
    true
  );


  galleryImage.addEventListener(
    'keydown',
    (event) => {

      if (
        event.key !== 'Enter' &&
        event.key !== ' '
      ) {
        return;
      }


      event.preventDefault();
      event.stopImmediatePropagation();

      openFullscreen();

    },
    true
  );


  backdrop.addEventListener(
    'click',
    closeFullscreen
  );


  closeButton.addEventListener(
    'click',
    closeFullscreen
  );


  document.addEventListener(
    'keydown',
    (event) => {

      if (
        event.key === 'Escape' &&
        !overlay.hidden
      ) {

        closeFullscreen();

      }

    }
  );

})();

/* FULLSCREEN PHOTO SCRIPT END */
