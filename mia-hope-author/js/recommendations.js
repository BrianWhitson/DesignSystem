(function () {
  "use strict";

  function recommendationCard(item) {
    return `
      <article class="recommendation-card fade-in">
        <img class="recommendation-cover" src="${window.Affiliate.escapeHtml(item.cover)}" alt="Recommendation placeholder for ${window.Affiliate.escapeHtml(item.title)}" loading="lazy" width="420" height="560">
        <div class="recommendation-body">
          <span class="pill">${window.Affiliate.escapeHtml(item.category)}</span>
          <h3>${window.Affiliate.escapeHtml(item.title)}</h3>
          <p><strong>Why Mia recommends it:</strong> ${window.Affiliate.escapeHtml(item.whyRecommended)}</p>
          <p><strong>Who would enjoy it:</strong> ${window.Affiliate.escapeHtml(item.whoWouldEnjoy)}</p>
          ${window.Affiliate.createAffiliateButton(item.amazonLink, "View on Amazon")}
        </div>
      </article>
    `;
  }

  function renderRecommendations(items) {
    document.querySelectorAll("[data-recommendations]").forEach((target) => {
      target.innerHTML = items.map(recommendationCard).join("");
    });
    window.Site.initRevealAnimations();
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.Site.fetchJson("data/recommendations.json")
      .then(renderRecommendations)
      .catch(() => {
        document.querySelectorAll("[data-recommendations]").forEach((target) => {
          target.innerHTML = '<p class="empty-state">Recommendation data could not be loaded. Please check data/recommendations.json.</p>';
        });
      });
  });
})();
