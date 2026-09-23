'use strict';

// Wspólna obsługa okien galerii: klawiatura, tło i powrót fokusu.
function createSiteDialog(element, firstControl, bodyClass) {
  let returnFocus = null;
  let background = [];
  const close = () => {
    if (element.hidden) return;
    element.hidden = true;
    element.setAttribute('aria-hidden', 'true');
    document.body.classList.remove(bodyClass);
    background.forEach(([node, inert]) => { node.inert = inert; });
    background = [];
    if (returnFocus?.isConnected) returnFocus.focus({preventScroll: true});
  };
  const open = (trigger) => {
    returnFocus = trigger || document.activeElement;
    background = [...document.body.children]
      .filter(node => node !== element && !['SCRIPT', 'STYLE'].includes(node.tagName))
      .map(node => [node, node.inert]);
    background.forEach(([node]) => { node.inert = true; });
    element.hidden = false;
    element.setAttribute('aria-hidden', 'false');
    document.body.classList.add(bodyClass);
    firstControl.focus();
  };
  element.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key !== 'Tab') return;
    const controls = [...element.querySelectorAll('button, a[href], [tabindex]')]
      .filter(node => !node.disabled && node.tabIndex >= 0 && node.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  });
  return {open, close};
}

(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  window.addEventListener('scroll', updateHeader, {passive: true});
  updateHeader();
  const setMenu = open => {
    menuButton?.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('open', open);
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) {
      setMenu(false); menuButton?.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!nav?.contains(event.target) && !menuButton?.contains(event.target)) setMenu(false);
  });
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const galleryItems = [
    {src:'/assets/images/pierwsze1.webp',alt:'Polski mechanik mobilnego serwisu TIR w Szwecji',width:800,height:1061},
    {src:'/assets/images/drugie.webp',alt:'Narzędzia i wyposażenie mobilnego serwisu',width:1200,height:904},
    {src:'/assets/images/trzecie.webp',alt:'Wyposażenie mobilnego serwisu przewożone w samochodzie',width:1200,height:1594}
  ];
  document.querySelectorAll('[data-photo-gallery]').forEach(gallery => {
    const image = gallery.querySelector('[data-gallery-image]');
    const previous = gallery.querySelector('[data-gallery-prev]');
    const next = gallery.querySelector('[data-gallery-next]');
    if (!image || !previous || !next) return;
    let index = 0, busy = false;
    const status = document.createElement('p');
    status.className = 'gallery-status';
    status.setAttribute('role', 'status');
    status.hidden = true;
    gallery.append(status);
    const buttons = () => {
      previous.hidden = index === 0;
      next.hidden = index === galleryItems.length - 1;
    };
    const show = async target => {
      if (busy || target < 0 || target >= galleryItems.length) return;
      const focusedControl = document.activeElement;
      busy = true; previous.disabled = next.disabled = true;
      status.textContent = '';
      status.hidden = true;
      const item = galleryItems[target];
      const preload = new Image();
      try {
        await new Promise((resolve, reject) => {
          preload.onload = resolve; preload.onerror = reject; preload.src = item.src;
        });
        image.src = item.src; image.alt = item.alt;
        image.width = item.width; image.height = item.height;
        index = target;
      } catch (_) {
        status.hidden = false;
        status.textContent = 'Nie udało się wczytać zdjęcia. Spróbuj ponownie.';
      } finally {
        busy = false; previous.disabled = next.disabled = false; buttons();
        if (document.activeElement === document.body) {
          if (focusedControl === previous) (previous.hidden ? next : previous).focus();
          if (focusedControl === next) (next.hidden ? previous : next).focus();
        }
      }
    };
    previous.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    buttons();

    const overlay = document.createElement('div');
    overlay.className = 'photo-fullscreen-overlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Powiększone zdjęcie');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = '<button class="photo-fullscreen-backdrop" type="button" tabindex="-1" aria-label="Zamknij powiększone zdjęcie"></button><div class="photo-fullscreen-content"><img class="photo-fullscreen-image" alt="" decoding="async"></div><button class="photo-fullscreen-close" type="button" aria-label="Zamknij zdjęcie">×</button>';
    document.body.append(overlay);
    const fullImage = overlay.querySelector('img');
    const closeButton = overlay.querySelector('.photo-fullscreen-close');
    const dialog = createSiteDialog(overlay, closeButton, 'photo-fullscreen-open');
    const open = () => {
      fullImage.src = image.currentSrc || image.src;
      fullImage.alt = image.alt;
      dialog.open(image);
    };
    image.addEventListener('click', open);
    image.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
    });
    closeButton.addEventListener('click', dialog.close);
    overlay.querySelector('.photo-fullscreen-backdrop').addEventListener('click', dialog.close);
  });
})();
