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

/* ===== MOBILE TAP PREVIEW WITH AUTO-FADE ===== */
function setupMobilePreviews() {
  const isMobile = window.matchMedia("(max-width: 599px)").matches;
  if (!isMobile) return;

  const gardenItems = document.querySelectorAll('.garden-item');
  let fadeTimeout;

  gardenItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Ignore clicks on modal triggers or "see more"
      if (e.target.classList.contains('open-post') || e.target.classList.contains('see-more')) return;

      clearTimeout(fadeTimeout);

      // Hide all other previews
      gardenItems.forEach(i => i.classList.remove('tap-show'));

      // Show this item's preview
      item.classList.add('tap-show');

      // Auto-hide after 4 seconds with smooth fade
      fadeTimeout = setTimeout(() => {
        item.classList.remove('tap-show');
      }, 4000);
    });
  });

  // Tapping outside closes previews immediately
  document.addEventListener('click', (e) => {
    const clickedItem = e.target.closest('.garden-item');
    if (!clickedItem) {
      gardenItems.forEach(i => i.classList.remove('tap-show'));
      clearTimeout(fadeTimeout);
    }
  });
}

// Initialize on load
setupMobilePreviews();

// Re-run on window resize for orientation changes
window.addEventListener('resize', () => {
  setupMobilePreviews();
});

