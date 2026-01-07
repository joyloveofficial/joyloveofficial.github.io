/* ===== MODAL FUNCTIONALITY ===== */

// Get modal elements
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const close = document.getElementById('close');

// Open modal when clicking a garden-item image
document.querySelectorAll('.garden-item').forEach(item => {
  const image = item.querySelector('.open-post');
  const content = item.querySelector('.post-content');

  image.addEventListener('click', () => {
    // Insert full post content into modal
    modalBody.innerHTML = content.innerHTML;

    // Show modal
    modal.classList.remove('hidden');
  });
});

// Close modal
close.addEventListener('click', () => {
  // Hide modal
  modal.classList.add('hidden');

  // Clear modal content
  modalBody.innerHTML = '';
});


/* ===== BACK-LINK FADE BEHAVIOR ===== */

// Get back-link element
const backLink = document.querySelector('.back-link');

// Timers for smooth fade
let scrollTimeout;
let hoverTimeout;


/* --- Fade out on scroll --- */
window.addEventListener('scroll', () => {
  // Hide back-link immediately
  backLink.classList.add('hidden');

  // Clear any existing timeout
  clearTimeout(scrollTimeout);

  // Fade back in after 1200ms pause
  scrollTimeout = setTimeout(() => {
    backLink.classList.remove('hidden');
  }, 1200);
});


/* --- Fade out while hovering garden items --- */
document.querySelectorAll('.garden-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    // Clear any existing hover timeout
    clearTimeout(hoverTimeout);

    // Use slower fade for a softer, wandering-friendly feel
    backLink.style.transition = 'opacity 1s ease';
    backLink.classList.add('hidden');
  });

  item.addEventListener('mouseleave', () => {
    // Delay before fading back in smoothly
    hoverTimeout = setTimeout(() => {
      backLink.style.transition = 'opacity 1s ease';
      backLink.classList.remove('hidden');
    }, 400); // 400ms delay
  });
});
