// ===== MODAL =====
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const close = document.getElementById('close');

// Open modal when clicking on a garden item image
document.querySelectorAll('.garden-item').forEach(item => {
  const image = item.querySelector('.open-post');
  const content = item.querySelector('.post-content');

  image.addEventListener('click', () => {
    modalBody.innerHTML = content.innerHTML; // insert full post content
    modal.classList.remove('hidden');        // show modal
  });
});

// Close modal
close.addEventListener('click', () => {
  modal.classList.add('hidden');            // hide modal
  modalBody.innerHTML = '';                 // clear content
});

// ===== BACK-LINK FADE BEHAVIOR =====
const backLink = document.querySelector('.back-link');
let scrollTimeout;

// Fade out on scroll
window.addEventListener('scroll', () => {
  backLink.classList.add('hidden');

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    backLink.classList.remove('hidden'); // fade back in after pause
  }, 1200);
});

// Fade out while hovering garden items
const gardenItems = document.querySelectorAll('.garden-item');

gardenItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    backLink.classList.add('hidden');
  });

  item.addEventListener('mouseleave', () => {
    setTimeout(() => {
      backLink.classList.remove('hidden');
    }, 800);
  });
});
