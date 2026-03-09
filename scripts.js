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

/* ===== CONSOLIDATED CLICK BEHAVIOR (DESKTOP & MOBILE) ===== */
document.querySelectorAll('.garden-item').forEach(item => {
  const image = item.querySelector('.open-post');
  const seeMore = item.querySelector('.see-more');
  const file = item.dataset.file;

  // Prevent download / right-click / drag
  image.setAttribute('draggable', 'false');
  image.addEventListener('contextmenu', e => e.preventDefault());

  // Handle image clicks for both mobile and desktop
  image.addEventListener('click', e => {
    const isMobile = window.matchMedia('(max-width: 599px)').matches;

    if (isMobile) {
      // MOBILE LOGIC: First tap = preview, Second tap = open
      if (!item.classList.contains('preview-active')) {
        e.preventDefault();
        e.stopPropagation();
        clearActivePreview();
        item.classList.add('preview-active'); // Show preview
      } else {
        // It's already active (second tap), open the modal
        item.classList.remove('preview-active');
        openPost(file);
      }
    } else {
      // DESKTOP LOGIC: Direct click opens modal
      openPost(file);
    }
  });

  // See more button opens modal directly (works on both desktop and mobile)
  if (seeMore) {
    seeMore.addEventListener('click', e => {
      e.stopPropagation();
      openPost(file);
    });
  }
});

// Mobile: Tap outside closes preview
document.addEventListener('touchstart', e => {
  if (!window.matchMedia('(max-width: 599px)').matches) return;
  const item = e.target.closest('.garden-item');
  if (!item) clearActivePreview();
});

function clearActivePreview() {
  document.querySelectorAll('.garden-item.preview-active').forEach(i => {
    i.classList.remove('preview-active');
  });
}

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
