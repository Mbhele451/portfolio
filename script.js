/* ==========================================================================
   Lerato Mbhele, portfolio
   Small, dependency-free, and safe to run with or without motion enabled.
   ========================================================================== */
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: add a glass background once the page scrolls ---------- */
  const header = document.querySelector(".site-header");
  const updateHeader = () => header && header.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  const setNav = (open) => {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".nav-toggle-label").textContent = open ? "Close" : "Menu";
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a, button")) setNav(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); toggle.focus(); }
    });
    // Reset if the window grows past the mobile breakpoint
    window.matchMedia("(min-width: 50.01rem)").addEventListener("change", (e) => { if (e.matches) setNav(false); });
  }

  /* ---------- Highlight the nav link for the section in view ---------- */
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", active);
          active ? link.setAttribute("aria-current", "true") : link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Gentle reveal for project visuals ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const reveal = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => reveal.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Slow parallax on the portrait (desktop, motion allowed) ---------- */
  const portrait = document.querySelector(".portrait");
  const wide = window.matchMedia("(min-width: 62.01rem)");
  if (portrait && !prefersReducedMotion) {
    let ticking = false;
    const move = () => {
      const y = wide.matches ? Math.min(window.scrollY, 800) * -0.06 : 0;
      portrait.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(move); }
    }, { passive: true });
  }

  /* ---------- CV preview dialog ---------- */
  const dialog = document.getElementById("cv-dialog");
  if (dialog && typeof dialog.showModal === "function") {
    const frame = dialog.querySelector("iframe");

    const openCV = () => {
      // Load the PDF only when asked, so the page stays light
      if (frame && !frame.getAttribute("src")) frame.setAttribute("src", frame.dataset.src);
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    };
    const closeCV = () => dialog.close();

    document.querySelectorAll("[data-open-cv]").forEach((btn) => btn.addEventListener("click", openCV));
    dialog.querySelector("[data-close-cv]").addEventListener("click", closeCV);
    // Click on the dimmed backdrop closes the dialog
    dialog.addEventListener("click", (e) => { if (e.target === dialog) closeCV(); });
    dialog.addEventListener("close", () => { document.documentElement.style.overflow = ""; });
  } else {
    // Very old browsers: skip the preview and open the PDF directly
    document.querySelectorAll("[data-open-cv]").forEach((btn) =>
      btn.addEventListener("click", () => window.open("assets/Lerato_Mbhele_CV.pdf", "_blank", "noopener"))
    );
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();