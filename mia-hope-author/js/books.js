(function () {
  "use strict";

  function formatDate(value) {
    if (!value) return "";

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  }

  function getBookDetailLink(book) {
    return `books/${encodeURIComponent(book.id)}.html`;
  }

  function getCoverSrc(book) {
    return book.cover || book.fallbackCover || "images/book-placeholder-1.svg";
  }

  function getCoverFallback(book) {
    return book.fallbackCover || "images/book-placeholder-1.svg";
  }

  function releaseDatePill(book) {
    const releaseDate = formatDate(book.releaseDate);
    return releaseDate ? `<li class="pill">${releaseDate}</li>` : "";
  }

  function bookCard(book, options = {}) {
    const buttonText = options.buttonText || "Buy on Amazon";
    const detailLink = getBookDetailLink(book);
    const coverSrc = getCoverSrc(book);
    const coverFallback = getCoverFallback(book);

    return `
      <article class="book-card fade-in" data-genre="${window.Affiliate.escapeHtml(book.genre)}" data-title="${window.Affiliate.escapeHtml(book.title)}">
        <a href="${detailLink}" aria-label="View details for ${window.Affiliate.escapeHtml(book.title)}">
          <img class="book-cover" src="${window.Affiliate.escapeHtml(coverSrc)}" alt="Cover for ${window.Affiliate.escapeHtml(book.title)}" loading="lazy" width="480" height="720" onerror="this.onerror=null; this.src='${window.Affiliate.escapeHtml(coverFallback)}';">
        </a>
        <div class="book-body">
          <ul class="meta-list" aria-label="Book details">
            <li class="pill">${window.Affiliate.escapeHtml(book.genre)}</li>
            ${releaseDatePill(book)}
          </ul>
          <h3><a href="${detailLink}">${window.Affiliate.escapeHtml(book.title)}</a></h3>
          <p>${window.Affiliate.escapeHtml(book.description)}</p>
          <ul class="tag-list" aria-label="Book themes">
            ${book.tags.map((tag) => `<li>${window.Affiliate.escapeHtml(tag)}</li>`).join("")}
          </ul>
          ${window.Affiliate.createAffiliateButton(book.amazonLink, buttonText)}
        </div>
      </article>
    `;
  }

  function populateGenreFilter(books) {
    const filter = document.querySelector("[data-book-filter]");
    if (!filter) return;

    const genres = [...new Set(books.map((book) => book.genre))].sort();
    filter.innerHTML = '<option value="all">All genres</option>' + genres.map((genre) => (
      `<option value="${window.Affiliate.escapeHtml(genre)}">${window.Affiliate.escapeHtml(genre)}</option>`
    )).join("");
  }

  function renderBooks(books, selector, options = {}) {
    const target = document.querySelector(selector);
    if (!target) return;

    const list = options.featuredOnly ? books.filter((book) => book.featured) : books;
    target.innerHTML = list.map((book) => bookCard(book, options)).join("");
    window.Site.initRevealAnimations();
  }

  function initBookSearch(books) {
    const search = document.querySelector("[data-book-search]");
    const filter = document.querySelector("[data-book-filter]");
    const target = document.querySelector("[data-books-grid]");
    if (!target) return;

    function applyFilters() {
      const query = (search && search.value ? search.value : "").toLowerCase().trim();
      const genre = filter && filter.value ? filter.value : "all";
      const filtered = books.filter((book) => {
        const matchesQuery = !query || `${book.title} ${book.description} ${book.genre} ${book.tags.join(" ")}`.toLowerCase().includes(query);
        const matchesGenre = genre === "all" || book.genre === genre;
        return matchesQuery && matchesGenre;
      });

      target.innerHTML = filtered.length
        ? filtered.map((book) => bookCard(book)).join("")
        : '<p class="empty-state">No books match that search yet. Try a different keyword or genre.</p>';
      window.Site.initRevealAnimations();
    }

    if (search) search.addEventListener("input", applyFilters);
    if (filter) filter.addEventListener("change", applyFilters);
    applyFilters();
  }

  function renderBookDetail(books) {
    const panel = document.querySelector("[data-book-detail]");
    if (!panel) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("book");
    const book = books.find((item) => item.id === id);
    if (!book) return;

    panel.classList.add("is-visible");
    const listing = document.querySelector("[data-book-listing]");
    if (listing) listing.hidden = true;
    const releaseDate = formatDate(book.releaseDate);
    const coverSrc = getCoverSrc(book);
    const coverFallback = getCoverFallback(book);
    panel.innerHTML = `
      <p class="breadcrumb"><a href="books.html">Books</a> / ${window.Affiliate.escapeHtml(book.title)}</p>
      <div class="split-grid">
        <img class="book-cover" src="${window.Affiliate.escapeHtml(coverSrc)}" alt="Cover for ${window.Affiliate.escapeHtml(book.title)}" loading="eager" width="480" height="720" onerror="this.onerror=null; this.src='${window.Affiliate.escapeHtml(coverFallback)}';">
        <div>
          <p class="eyebrow">${window.Affiliate.escapeHtml(book.genre)}</p>
          <h2>${window.Affiliate.escapeHtml(book.title)}</h2>
          <p class="lead">${window.Affiliate.escapeHtml(book.subtitle)}</p>
          ${releaseDate ? `<p><strong>Release date:</strong> ${releaseDate}</p>` : ""}
          <p>${window.Affiliate.escapeHtml(book.longDescription)}</p>
          <div class="reviews" aria-label="Reviews for ${window.Affiliate.escapeHtml(book.title)}">
            ${book.reviews.map((review) => `
              <blockquote>
                <p>"${window.Affiliate.escapeHtml(review.quote)}"</p>
                <cite>${window.Affiliate.escapeHtml(review.source)}</cite>
              </blockquote>
            `).join("")}
          </div>
          <div class="card-grid">
            ${book.purchaseOptions.map((option) => window.Affiliate.createAffiliateButton(option.url, `Buy ${option.label} on Amazon`)).join("")}
          </div>
        </div>
      </div>
    `;
    panel.scrollIntoView({ block: "start" });
  }

  function injectBookSchema(books) {
    window.Site.injectJsonLd("schema-books", {
      "@context": "https://schema.org",
      "@graph": books.map((book) => ({
        "@type": "Book",
        "name": book.title,
        "description": book.description,
        "genre": book.genre,
        "datePublished": book.releaseDate,
        "publisher": {
          "@type": "Organization",
          "name": "Lucy Nell Publishing"
        },
        "url": `https://www.lucynellpublishing.com/books/${book.id}.html`
      }))
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.Site.fetchJson("data/books.json")
      .then((books) => {
        renderBooks(books, "[data-featured-books]", { featuredOnly: true, buttonText: "Explore on Amazon" });
        populateGenreFilter(books);
        initBookSearch(books);
        renderBookDetail(books);
        injectBookSchema(books);
      })
      .catch(() => {
        document.querySelectorAll("[data-featured-books], [data-books-grid]").forEach((target) => {
          target.innerHTML = '<p class="empty-state">Book data could not be loaded. Please check data/books.json.</p>';
        });
      });
  });
})();
