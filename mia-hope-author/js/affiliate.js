(function () {
  "use strict";

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function createAffiliateButton(url, text) {
    const safeUrl = escapeHtml(url);
    const safeText = escapeHtml(text || "Buy on Amazon");

    return `
      <div class="affiliate-product">
        <a class="affiliate-button" href="${safeUrl}" target="_blank" rel="nofollow sponsored noopener">${safeText}</a>
        <p class="affiliate-note">Affiliate link. As an Amazon Associate I earn from qualifying purchases.</p>
      </div>
    `;
  }

  window.Affiliate = {
    createAffiliateButton,
    escapeHtml
  };
})();
