/* ==========================================================================
   ORBIS — animations.js
   Revela elementos [data-reveal] conforme entram na viewport
   ========================================================================== */

"use strict";

(function () {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* Sem animação (ou sem suporte a IntersectionObserver): mostra tudo */
  if (
    prefersReducedMotion ||
    typeof window.IntersectionObserver !== "function"
  ) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const delay = parseInt(el.dataset.revealDelay || "0", 10);
        if (delay) {
          el.style.setProperty("--reveal-delay", delay + "ms");
        }

        el.classList.add("is-visible");
        observer.unobserve(el);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  items.forEach((el) => observer.observe(el));
})();
