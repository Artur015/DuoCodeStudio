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
  let lockedScrollY = 0;

  function lockPageScroll() {
    lockedScrollY = window.scrollY;
    document.documentElement.classList.add("is-menu-open");
    document.body.classList.add("is-menu-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlockPageScroll() {
    document.documentElement.classList.remove("is-menu-open");
    document.body.classList.remove("is-menu-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.documentElement.classList.add("is-restoring-scroll");
    window.scrollTo(0, lockedScrollY);
    window.requestAnimationFrame(() => {
      document.documentElement.classList.remove("is-restoring-scroll");
    });
  }

  function setMenuState(isOpen) {
    const wasOpen = menuToggle.getAttribute("aria-expanded") === "true";

    siteHeader.classList.toggle("is-menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? closeLabel : openLabel);

    if (isOpen && !wasOpen) {
      lockPageScroll();
    }

    if (!isOpen && wasOpen) {
      unlockPageScroll();
    }
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("click", (event) => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    if (!isOpen || menuToggle.contains(event.target)) {
      return;
    }

    setMenuState(false);
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
