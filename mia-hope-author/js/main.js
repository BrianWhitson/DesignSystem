(function () {
  "use strict";

  const dataCache = new Map();

  function $(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function $$(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  async function fetchJson(path) {
    if (dataCache.has(path)) {
      return dataCache.get(path);
    }

    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Unable to load ${path}`);
    }

    const data = await response.json();
    dataCache.set(path, data);
    return data;
  }

  function setCurrentNav() {
    const current = window.location.pathname.split("/").pop() || "index.html";
    $$(".primary-nav a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === current || (current === "" && href === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initNavigation() {
    const toggle = $(".nav-toggle");
    const nav = $(".primary-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.matches("a")) {
        nav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initBackToTop() {
    const button = $(".back-to-top");
    if (!button) return;

    window.addEventListener("scroll", () => {
      button.classList.toggle("is-visible", window.scrollY > 520);
    }, { passive: true });

    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function initReadingProgress() {
    const bar = $(".progress-bar");
    if (!bar) return;

    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${Math.min(progress, 100)}%`;
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function initRevealAnimations() {
    const elements = $$(".fade-in");
    if (!elements.length || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach((element) => observer.observe(element));
  }

  function initForms() {
    $$("form[data-placeholder-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const status = form.querySelector("[data-form-status]");
        if (status) {
          status.textContent = "Thank you. This demo form is ready to connect to your email or contact service.";
        }
        form.reset();
      });
    });
  }

  function renderTestimonials() {
    const target = $("[data-testimonials]");
    if (!target) return;

    fetchJson("data/testimonials.json")
      .then((testimonials) => {
        target.innerHTML = testimonials.map((item) => `
          <blockquote class="testimonial-card fade-in">
            <p>"${window.Affiliate.escapeHtml(item.quote)}"</p>
            <cite>${window.Affiliate.escapeHtml(item.source)}</cite>
          </blockquote>
        `).join("");
        initRevealAnimations();
      })
      .catch(() => {
        target.innerHTML = '<p class="empty-state">Testimonials will appear here once reader quotes are added.</p>';
      });
  }

  function injectJsonLd(id, data) {
    let script = document.getElementById(id);
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data, null, 2);
  }

  function addBaseSchema() {
    injectJsonLd("schema-author", {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Mia Hope",
      "url": "https://www.miahopeauthor.com/",
      "description": "Mia Hope writes contemporary romance novels with relatable characters, vulnerable heroes, and strong heroines.",
      "sameAs": []
    });

    injectJsonLd("schema-website", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Mia Hope Author",
      "url": "https://www.miahopeauthor.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.miahopeauthor.com/blog.html?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setCurrentNav();
    initNavigation();
    initBackToTop();
    initReadingProgress();
    initRevealAnimations();
    initForms();
    renderTestimonials();
    addBaseSchema();
  });

  window.Site = {
    fetchJson,
    injectJsonLd,
    initRevealAnimations
  };
})();
