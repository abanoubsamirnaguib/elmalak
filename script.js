(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const nav = document.getElementById("primary-nav");
  const toggle = document.querySelector(".nav-toggle");

  const setExpanded = (expanded) => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    nav.classList.toggle("is-open", expanded);
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      setExpanded(!expanded);
    });

    // Close nav on link click (mobile)
    nav.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof HTMLElement && target.matches("a.nav-link")) {
        setExpanded(false);
      }
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(target) || toggle.contains(target)) return;
      setExpanded(false);
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setExpanded(false);
    });
  }

  // Slider: handled by Bootstrap Carousel (no JS needed here)

  // Active section highlight
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = links
    .map((a) => {
      const id = a.getAttribute("href")?.slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  const setActive = (id) => {
    for (const link of links) {
      const href = link.getAttribute("href");
      link.classList.toggle("is-active", href === `#${id}`);
    }
  };

  if (sections.length > 0 && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActive(visible.target.id);
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0.1, 0.2, 0.4, 0.6],
      }
    );

    sections.forEach((s) => io.observe(s));
  }

  // Optional: count-up animation (simple, only when visible)
  const counters = Array.from(document.querySelectorAll("[data-count]"));
  if (counters.length > 0 && "IntersectionObserver" in window) {
    const animate = (el) => {
      const end = Number(el.getAttribute("data-count")) || 0;
      const start = 0;
      const duration = 700;
      const t0 = performance.now();

      const step = (t) => {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = Math.round(start + (end - start) * eased);
        el.textContent = String(value);
        if (p < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target;
          animate(el);
          obs.unobserve(el);
        }
      },
      { threshold: 0.35 }
    );

    counters.forEach((c) => io.observe(c));
  }
})();
