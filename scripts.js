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

/* --- Open modal by fetching post file --- */
document.querySelectorAll('.garden-item').forEach(item => {
  const image = item.querySelector('.open-post');
  const seeMore = item.querySelector('.see-more');
  const file = item.dataset.file;

  async function openPost() {
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

  image.addEventListener('click', openPost);

  if (seeMore) {
    seeMore.addEventListener('click', (e) => {
      e.stopPropagation();
      openPost();
    });
  }
});


/* --- Close modal via close button --- */
close.addEventListener('click', closeModal);

/* --- Close modal when clicking outside content --- */
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

/* --- Close modal with Escape key --- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

/* --- Close modal by clicking overlay --- */
modalOverlay.addEventListener('click', closeModal);



/* ===== BACK-LINK FADE BEHAVIOR ===== */
const backLink = document.querySelector('.back-link');
let scrollTimeout;
let hoverTimeout;

/* --- Fade out on scroll --- */
window.addEventListener('scroll', () => {
  backLink.classList.add('hidden');
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    backLink.classList.remove('hidden');
  }, 1200);
});

/* --- Fade out while hovering garden items --- */
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

/* ===== COPYRIGHT FADE ===== */
const copyright = document.querySelector('.copyright');
let copyrightTimeout;

window.addEventListener('scroll', () => {
  copyright.style.opacity = 0.2;   // fade out while scrolling

  clearTimeout(copyrightTimeout);
  copyrightTimeout = setTimeout(() => {
    copyright.style.opacity = 0.4; // fade back in after pause
  }, 1200);
});

/* ===== MOBILE: COPYRIGHT FADE ON SCROLL ===== */
function setupMobileCopyrightFade() {
  const isMobile = window.matchMedia("(max-width: 599px)").matches;
  if (!isMobile) return;

  const copyright = document.querySelector('.copyright');
  let copyrightTimeout;

  window.addEventListener('scroll', () => {
    if (!copyright) return;

    // Fade out while scrolling
    copyright.style.opacity = 0.2;

    // Fade back in after scroll stops
    clearTimeout(copyrightTimeout);
    copyrightTimeout = setTimeout(() => {
      copyright.style.opacity = 0.4;
    }, 2400);
  });
}

// Initialize on load
setupMobileCopyrightFade();

// Re-run on resize/orientation change
window.addEventListener('resize', setupMobileCopyrightFade);


/* ===== MOBILE: PRESS FOR PREVIEW, TAP FOR MODAL ===== */
let activeGardenItem = null;
let pressTimer = null;
const PRESS_DELAY = 200; // ms until press counts as "hold"

document.querySelectorAll('.garden-item').forEach(item => {
  const image = item.querySelector('.open-post');

  /* ---- PRESS & HOLD (preview while holding) ---- */
  image.addEventListener('touchstart', (e) => {
    if (!window.matchMedia('(max-width: 599px)').matches) return;

    pressTimer = setTimeout(() => {
      // Show preview while pressing
      clearActivePreview();
      item.classList.add('preview-active');
      activeGardenItem = item;
    }, PRESS_DELAY);
  });

  image.addEventListener('touchend', () => {
    clearTimeout(pressTimer);

    // Hide preview on release if modal did not open
    if (activeGardenItem === item) {
      item.classList.remove('preview-active');
      activeGardenItem = null;
    }
  });

  /* ---- TAP LOGIC ---- */
  image.addEventListener('click', (e) => {
    if (!window.matchMedia('(max-width: 599px)').matches) return;

    // First tap → preview
    if (activeGardenItem !== item) {
      e.preventDefault();
      e.stopPropagation();

      clearActivePreview();
      item.classList.add('preview-active');
      activeGardenItem = item;
      return;
    }

    // Second tap → modal
    activeGardenItem = null;
    item.classList.remove('preview-active');
    // modal opens naturally via your existing openPost() listener
  });
});

/* ---- Tap anywhere else closes preview ---- */
document.addEventListener('touchstart', (e) => {
  if (e.targetTouches.length > 1) return; // ignore multi-touch gestures
  const item = e.target.closest('.garden-item');
  if (!item) {
    clearActivePreview();
  }
});

/* ---- Clear any active preview ---- */
function clearActivePreview() {
  document.querySelectorAll('.garden-item.preview-active')
    .forEach(i => i.classList.remove('preview-active'));
  activeGardenItem = null;
}
