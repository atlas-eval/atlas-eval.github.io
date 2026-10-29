(() => {
  if (window.location.hostname === 'atlas-eval.github.io') {
    const analytics = document.createElement('script');
    analytics.type = 'module';
    analytics.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    analytics.dataset.cfBeacon = JSON.stringify({ token: 'f57509328ae9411ea1c254af696294d3' });
    document.head.append(analytics);
  }

  const header = document.querySelector('[data-site-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-site-menu]');

  if (header) {
    const setHeaderState = () => header.classList.toggle('is-scrolled', window.scrollY > 14);
    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('is-open', !expanded);
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
      });
    });
  }

  const citationButton = document.querySelector('[data-copy-citation]');
  const citationCode = document.querySelector('#bibtex');
  const citationStatus = document.querySelector('#citation-status');

  if (citationButton && citationCode && citationStatus) {
    citationButton.addEventListener('click', async () => {
      citationButton.disabled = true;
      citationStatus.textContent = '';
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(citationCode.textContent.trim());
        citationStatus.textContent = 'BibTeX copied to clipboard.';
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(citationCode);
        selection?.removeAllRanges();
        selection?.addRange(range);
        citationStatus.textContent = 'Automatic copy is unavailable. The citation is selected; press Ctrl+C or ⌘C to copy.';
      } finally {
        citationButton.disabled = false;
      }
    });
  }

  const lightbox = document.querySelector('[data-image-lightbox]');
  const lightboxImage = document.querySelector('[data-lightbox-image]');
  const lightboxClose = document.querySelector('[data-lightbox-close]');
  const imageTriggers = document.querySelectorAll('[data-image-zoom]');

  if (lightbox && lightboxImage && imageTriggers.length) {
    const closeLightbox = () => {
      lightbox.close();
      lightboxImage.removeAttribute('src');
      lightboxImage.alt = '';
    };

    imageTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const image = trigger.querySelector('img');
        if (!image) return;
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightbox.showModal();
      });
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
  );

  revealItems.forEach((item) => observer.observe(item));
})();
