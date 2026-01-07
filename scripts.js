/* ===== MODAL FUNCTIONALITY ===== */
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const close = document.getElementById('close');

/* --- Open modal by fetching post file --- */
document.querySelectorAll('.garden-item').forEach(item => {
  const image = item.querySelector('.open-post');
  const readMore = item.querySelector('.read-more');
  const file = item.dataset.file;

/* when image is clicked */
  image.addEventListener('click', async () => {
    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error('Post not found');
      const html = await response.text();
      modalBody.innerHTML = html;
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    } catch (error) {
      modalBody.innerHTML = '<p>Sorry, this post could not be loaded.</p>';
      modal.classList.add('active');
      console.error(error);
    }
  });
});

  // When "read more" is clicked
  if (readMore) {
    readMore.addEventListener('click', async (e) => {
      e.stopPropagation();   /* prevents the parent element click from firing twice */
      await openModal(file);
    });
  }
});

/* --- Close modal --- */
close.addEventListener('click', () => {
  modal.classList.remove('active');
  modalBody.innerHTML = '';
  document.body.classList.remove('modal-open');
});

/* --- Close modal when clicking outside content --- */
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
    modalBody.innerHTML = '';
    document.body.classList.remove('modal-open');
  }
});

/* --- Close modal with Escape key --- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    modal.classList.remove('active');
    modalBody.innerHTML = '';
    document.body.classList.remove('modal-open');
  }
});

/* forces modal closed on open to confirm error (delete later?) */

window.addEventListener('DOMContentLoaded', () => {
  modal.classList.remove('active');  /* make sure it starts hidden */
});



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
