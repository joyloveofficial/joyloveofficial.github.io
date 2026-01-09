/* ===== FULL GARDEN JS (DESKTOP FIRST, MOBILE OVERRIDES LATER) ===== */

/* ===== MODAL FUNCTIONALITY ===== */
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const close = document.getElementById('close');
const modalOverlay = document.getElementById('modalOverlay');

function closeModal() {
  modal.classList.remove('active');
  modalBody.innerHTML = '';
  document.body.classList.remove('modal-open');
  modalOverlay.classList.remove('active');
}

async function openPost(file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error('Post not found');
    const html = await response.text();
    modalBody.innerHTML = html;
    modal.classList.add('active');
    modalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
  } catch (error) {
    modalBody.innerHTML = '<p>Sorry, this post could not be loaded.</p>';
    modal.classList.add('active');
    console.error(error);
  }
}

/* ===== DESKTOP BEHAVIOR ===== */
document.querySelectorAll('.garden-item').forEach(item => {
  const image = item.querySelector('.open-post');
  const seeMore = item.querySelector('.see-more');
  const file = item.dataset.file;

  // Prevent download / right-click / drag
  image.setAttribute('draggable', 'false');
  image.addEventListener('contextmenu', e => e.preventDefault());

  // Desktop click opens modal
  image.addEventListener('click', e => {
    if (window.matchMedia('(min-width: 600px)').matches) {
      openPost(file);
    }
  });

  // See more button also opens modal
  if (seeMore) {
    seeMore.addEventListener('click', e => {
      e.stopPropagation();
      openPost(file);
    });
  }
});

/* ===== MODAL CLOSE ===== */
close.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });

/* ===== BACK-LINK FADE ===== */
const backLink = document.querySelector('.back-link');
let scrollTimeout, hoverTimeout;

if (backLink) {
  window.addEventListener('scroll', () => {
    backLink.classList.add('hidden');
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      backLink.classList.remove('hidden');
    }, 1200);
  });

  document.querySelectorAll('.garden-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      backLink.style.transition = 'opacity 1s ease';
      backLink.classList.add('hidden');
    });

    item.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        backLink.style.transition = 'opacity 1s ease';
        backLink.classList.remove('hidden');
      }, 400);
    });
  });
}

/* ===== COPYRIGHT FADE ===== */
const copyright = document.querySelector('.copyright');
let copyrightTimeout;

if (copyright) {
  window.addEventListener('scroll', () => {
    copyright.style.opacity = 0.2;
    clearTimeout(copyrightTimeout);
    copyrightTimeout = setTimeout(() => {
      copyright.style.opacity = 0.4;
    }, 1200);
  });
}

/* ===== MOBILE OVERRIDES (PRESS & TAP PREVIEWS) ===== */
let activeGardenItem = null;
let pressTimer = null;
const PRESS_DELAY = 200; // ms until press counts as "hold"

document.querySelectorAll('.garden-item').forEach(item => {
  const image = item.querySelector('.open-post');
  const file = item.dataset.file;

  // Mobile: press & hold preview
  image.addEventListener('touchstart', e => {
    if (!window.matchMedia('(max-width: 599px)').matches) return;

    pressTimer = setTimeout(() => {
      clearActivePreview();
      item.classList.add('preview-active');
      activeGardenItem = item;
    }, PRESS_DELAY);
  });

  image.addEventListener('touchend', e => {
    if (!window.matchMedia('(max-width: 599px)').matches) return;

    clearTimeout(pressTimer);

    if (activeGardenItem === item && !item.dataset.modalOpened) {
      item.classList.remove('preview-active');
      activeGardenItem = null;
    }

    item.dataset.modalOpened = '';
  });

  // Mobile: tap once for preview, tap again for modal
  image.addEventListener('click', e => {
    if (!window.matchMedia('(max-width: 599px)').matches) return;

    if (activeGardenItem !== item) {
      e.preventDefault();
      e.stopPropagation();
      clearActivePreview();
      item.classList.add('preview-active');
      activeGardenItem = item;
      return;
    }

    // Second tap → modal
    item.dataset.modalOpened = 'true';
    activeGardenItem = null;
    item.classList.remove('preview-active');
    openPost(file);
  });
});

// Tap outside closes preview
document.addEventListener('touchstart', e => {
  if (!window.matchMedia('(max-width: 599px)').matches) return;

  const item = e.target.closest('.garden-item');
  if (!item) clearActivePreview();
});

function clearActivePreview() {
  document.querySelectorAll('.garden-item.preview-active').forEach(i => i.classList.remove('preview-active'));
  activeGardenItem = null;
}
