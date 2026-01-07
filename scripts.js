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
  const readMore = item.querySelector('.read-more');
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

  if (readMore) {
    readMore.addEventListener('click', (e) => {
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

