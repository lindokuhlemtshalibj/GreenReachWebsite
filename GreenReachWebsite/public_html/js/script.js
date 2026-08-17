/* ---------- FORM VALIDATION ---------- */
document.addEventListener("DOMContentLoaded", function() {
  const forms = document.querySelectorAll("form");

  forms.forEach(form => {
    form.addEventListener("submit", function(event) {
      const inputs = form.querySelectorAll("input[required], textarea[required]");
      let valid = true;

      inputs.forEach(input => {
        if (input.value.trim() === "") {
          valid = false;
          input.style.border = "2px solid red";
        } else {
          input.style.border = "1px solid #ccc";
        }
      });

      if (!valid) {
        event.preventDefault();
        alert("⚠️ Please fill in all required fields before submitting.");
      } else {
        alert("✅ Thank you for getting in touch with GreenReach! We will respond soon.");
      }
    });
  });
});

/* ---------- NAVIGATION LINK HIGHLIGHT ---------- */
document.addEventListener("DOMContentLoaded", function() {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("nav ul li a");

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});

/* ---------- SIMPLE IMAGE SLIDER FOR HOME PAGE ---------- */
let currentSlide = 0;

function showSlide(index) {
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide, i) => {
    slide.style.display = (i === index) ? "block" : "none";
  });
}

function nextSlide() {
  const slides = document.querySelectorAll(".slide");
  if (slides.length > 0) {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }
}

// Run the slider every 4 seconds if there are slides
setInterval(nextSlide, 4000);


