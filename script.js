const yearTarget = document.getElementById("year");
const revealElements = document.querySelectorAll("[data-reveal]");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");

function setupRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setupMobileMenu() {
  if (!siteHeader || !menuToggle) {
    return;
  }

  const menuId = menuToggle.getAttribute("aria-controls");
  const menu = menuId ? document.getElementById(menuId) : null;
  const openLabel = menuToggle.dataset.menuOpenLabel || "Open menu";
  const closeLabel = menuToggle.dataset.menuCloseLabel || "Close menu";
  const desktopQuery = window.matchMedia("(min-width: 761px)");

  function setMenuState(isOpen) {
    siteHeader.classList.toggle("is-menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? closeLabel : openLabel);
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });

  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) {
      setMenuState(false);
    }
  });
}

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

setupMobileMenu();
setupRevealObserver();
