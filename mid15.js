// Hide Page Loader
window.addEventListener("load", () => {
  const loader = document.querySelector(".page-loader");

  if (loader) {
    loader.classList.add("loaded");
  }
});

// Elements
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const backToTop = document.querySelector(".back-to-top");
const revealElements = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const skillCards = document.querySelectorAll(".skill-card");
const filterBtns = document.querySelectorAll(".filter-btn");
const caseCards = document.querySelectorAll(".case-card");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const year = document.getElementById("year");

// Current Year
if (year) {
  year.textContent = new Date().getFullYear();
}

// Mobile Navigation
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navLinks.classList.toggle("open");

    const isOpen = navLinks.classList.contains("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  navItems.forEach(link => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("open");
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Header Shadow + Back To Top
window.addEventListener("scroll", () => {
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  if (backToTop) {
    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  activateNavLink();
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// Reveal Animation
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        if (entry.target.classList.contains("skill-card")) {
          const progressValue = entry.target.getAttribute("data-progress");
          const progressBar = entry.target.querySelector(".progress span");

          if (progressBar && progressValue) {
            progressBar.style.width = progressValue + "%";
          }
        }

        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach(element => {
  revealObserver.observe(element);
});

// Counters Animation
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;

  const metricsSection = document.querySelector(".hero-metrics");
  if (!metricsSection) return;

  const rect = metricsSection.getBoundingClientRect();

  if (rect.top < window.innerHeight && rect.bottom > 0) {
    countersStarted = true;

    counters.forEach(counter => {
      const target = Number(counter.getAttribute("data-target"));
      let current = 0;
      const speed = Math.max(1, Math.floor(target / 70));

      const updateCounter = () => {
        current += speed;

        if (current >= target) {
          counter.textContent = target;
        } else {
          counter.textContent = current;
          requestAnimationFrame(updateCounter);
        }
      };

      updateCounter();
    });
  }
}

window.addEventListener("scroll", startCounters);
window.addEventListener("load", startCounters);

// Portfolio Filter
filterBtns.forEach(button => {
  button.addEventListener("click", () => {
    filterBtns.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.getAttribute("data-filter");

    caseCards.forEach(card => {
      const category = card.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        card.classList.remove("hide");
      } else {
        card.classList.add("hide");
      }
    });
  });
});

// Active Navbar Link On Scroll
function activateNavLink() {
  const sections = document.querySelectorAll("section[id]");
  let currentSection = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id");
    }
  });

  navItems.forEach(link => {
    link.classList.remove("active");

    const href = link.getAttribute("href");

    if (href === "#" + currentSection) {
      link.classList.add("active");
    }
  });
}

// Contact Form
if (contactForm && formStatus) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subjectInput = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    formStatus.classList.remove("error");

    if (!name || !email || !subjectInput || !message) {
      formStatus.textContent = "Please fill in all fields.";
      formStatus.classList.add("error");
      return;
    }

    const subject = encodeURIComponent(subjectInput);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    formStatus.textContent = "Opening your email app...";

    setTimeout(() => {
      window.location.href =
        `mailto:nour.haddad.dentistry@example.com?subject=${subject}&body=${body}`;
    }, 700);

    contactForm.reset();
  });
}