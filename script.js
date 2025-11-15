const ready = () => {
  const body = document.body;
  const hamburger = document.querySelector('[data-hamburger]');
  const overlay = document.querySelector('[data-menu-overlay]');
  const closeMenuButton = document.querySelector('[data-menu-close]');
  const menuLinks = document.querySelectorAll('.menu-link');

  let overlayCount = 0;
  const lockBody = () => {
    overlayCount += 1;
    body.classList.add('scroll-lock');
  };

  const unlockBody = () => {
    overlayCount = Math.max(overlayCount - 1, 0);
    if (overlayCount === 0) {
      body.classList.remove('scroll-lock');
    }
  };

  const toggleMenu = (open) => {
    if (!overlay) return;
    const isOpen = overlay.classList.contains('open');
    if (open === isOpen) return;
    overlay.classList.toggle('open', open);
    overlay.setAttribute('aria-hidden', String(!open));
    hamburger?.setAttribute('aria-expanded', String(open));
    if (open) {
      lockBody();
    } else {
      unlockBody();
    }
  };

  hamburger?.addEventListener('click', () => toggleMenu(true));
  closeMenuButton?.addEventListener('click', () => toggleMenu(false));

  overlay?.addEventListener('click', (event) => {
    if (event.target === overlay) {
      toggleMenu(false);
    }
  });

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  const galleryButtons = document.querySelectorAll('[data-gallery-item]');
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxFigure = document.querySelector('[data-lightbox-figure]');
  const lightboxLabel = document.querySelector('[data-lightbox-label]');
  const lightboxCloseButton = document.querySelector('[data-lightbox-close]');

  const openLightbox = (label) => {
    if (!lightbox || !lightboxFigure) return;
    const message = `${label} を拡大表示`;
    lightboxFigure.textContent = label;
    if (lightboxLabel) {
      lightboxLabel.textContent = message;
    }
    if (!lightbox.classList.contains('open')) {
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      lockBody();
    }
  };

  const closeLightbox = () => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    unlockBody();
  };

  lightboxCloseButton?.addEventListener('click', closeLightbox);

  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  galleryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const label = button.dataset.label || 'ギャラリー写真';
      openLightbox(label);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleMenu(false);
      closeLightbox();
    }
  });
};

document.addEventListener('DOMContentLoaded', ready);
