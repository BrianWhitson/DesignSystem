(function () {
  "use strict";

  function formatDate(value) {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date(`${value}T00:00:00`));
  }

  function blogCard(post) {
    return `
      <article class="blog-card fade-in" data-category="${window.Affiliate.escapeHtml(post.category)}">
        <span class="blog-category">${window.Affiliate.escapeHtml(post.category)}</span>
        <h3><a href="blog.html?post=${encodeURIComponent(post.slug)}">${window.Affiliate.escapeHtml(post.title)}</a></h3>
        <p class="article-meta">${formatDate(post.date)} · ${window.Affiliate.escapeHtml(post.readingTime)}</p>
        <p>${window.Affiliate.escapeHtml(post.excerpt)}</p>
        <a class="button button-secondary" href="blog.html?post=${encodeURIComponent(post.slug)}">Read article</a>
      </article>
    `;
  }

  function renderArticle(posts) {
    const articleTarget = document.querySelector("[data-blog-article]");
    if (!articleTarget) return false;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("post");
    const post = posts.find((item) => item.slug === slug);
    if (!post) return false;

    const index = document.querySelector("[data-blog-index]");
    if (index) index.hidden = true;

    articleTarget.innerHTML = `
      <article class="article">
        <p class="breadcrumb"><a href="blog.html">Blog</a> / ${window.Affiliate.escapeHtml(post.category)}</p>
        <p class="eyebrow">${window.Affiliate.escapeHtml(post.category)}</p>
        <h1>${window.Affiliate.escapeHtml(post.title)}</h1>
        <p class="article-meta">${formatDate(post.date)} · ${window.Affiliate.escapeHtml(post.readingTime)}</p>
        ${post.content.map((paragraph) => `<p>${window.Affiliate.escapeHtml(paragraph)}</p>`).join("")}
      </article>
    `;

    document.title = `${post.title} | Mia Hope Blog`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", post.excerpt);

    window.Site.injectJsonLd("schema-blog-post", {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": "Mia Hope"
      },
      "mainEntityOfPage": `https://www.miahopeauthor.com/blog.html?post=${post.slug}`
    });

    return true;
  }

  function populateCategoryFilter(posts) {
    const filter = document.querySelector("[data-blog-filter]");
    if (!filter) return;

    const categories = [...new Set(posts.map((post) => post.category))].sort();
    filter.innerHTML = '<option value="all">All categories</option>' + categories.map((category) => (
      `<option value="${window.Affiliate.escapeHtml(category)}">${window.Affiliate.escapeHtml(category)}</option>`
    )).join("");
  }

  function initBlogSearch(posts) {
    const target = document.querySelector("[data-blog-list]");
    if (!target) return;

    const search = document.querySelector("[data-blog-search]");
    const filter = document.querySelector("[data-blog-filter]");
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get("search");
    if (search && initialSearch) search.value = initialSearch;

    function render() {
      const query = (search && search.value ? search.value : "").toLowerCase().trim();
      const category = filter && filter.value ? filter.value : "all";
      const filtered = posts.filter((post) => {
        const matchesQuery = !query || `${post.title} ${post.excerpt} ${post.category} ${post.content.join(" ")}`.toLowerCase().includes(query);
        const matchesCategory = category === "all" || post.category === category;
        return matchesQuery && matchesCategory;
      });

      target.innerHTML = filtered.length
        ? filtered.map(blogCard).join("")
        : '<p class="empty-state">No posts match that search yet.</p>';
      window.Site.initRevealAnimations();
    }

    if (search) search.addEventListener("input", render);
    if (filter) filter.addEventListener("change", render);
    render();
  }

  function injectBlogSchema(posts) {
    window.Site.injectJsonLd("schema-blog", {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Mia Hope Blog",
      "blogPost": posts.map((post) => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "datePublished": post.date,
        "url": `https://www.miahopeauthor.com/blog.html?post=${post.slug}`
      }))
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.Site.fetchJson("data/blog.json")
      .then((posts) => {
        const renderedArticle = renderArticle(posts);
        if (!renderedArticle) {
          populateCategoryFilter(posts);
          initBlogSearch(posts);
        }
        injectBlogSchema(posts);
      })
      .catch(() => {
        const target = document.querySelector("[data-blog-list], [data-blog-article]");
        if (target) {
          target.innerHTML = '<p class="empty-state">Blog data could not be loaded. Please check data/blog.json.</p>';
        }
      });
  });
})();
