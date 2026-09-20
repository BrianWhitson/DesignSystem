# Lucy Nell Publishing Website

Modern static publishing website for Lucy Nell Publishing, built with HTML5, CSS3, vanilla JavaScript, and JSON content files.

## Project structure

```text
mia-hope-author/
├── index.html
├── books.html
├── blog.html
├── resources.html
├── contact.html
├── privacy.html
├── amazon-disclosure.html
├── css/style.css
├── js/main.js
├── js/books.js
├── js/blog.js
├── js/affiliate.js
├── js/recommendations.js
├── data/books.json
├── data/blog.json
├── data/recommendations.json
├── data/testimonials.json
└── images/
```

## Local setup

Run a static server from this directory:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/`.

Do not open the HTML files directly with `file://` because browser security rules may block JSON `fetch()` calls.

## Adding a new book

1. Add a new object to `data/books.json`.
2. Use a unique lowercase `id`, such as `coastal-hearts`.
3. Add the approved title, original description, genre, release date, local cover image path, tags, reviews, and purchase options.
4. Set `featured` to `true` if the book should appear on the home page.
5. Replace placeholder Amazon URLs with approved Amazon Associates links.

Book cards, detail views, reviews, filters, purchase buttons, and Book schema are generated from this file.

## Adding Amazon affiliate links safely

1. Put Amazon URLs only in JSON fields such as `amazonLink` or `purchaseOptions[].url`.
2. Use the reusable component in `js/affiliate.js`; it adds `rel="nofollow sponsored noopener"`.
3. Keep a nearby disclosure for every Amazon button: `Affiliate link. As an Amazon Associate I earn from qualifying purchases.`
4. Do not claim Amazon endorses Lucy Nell Publishing, the books, or the website.
5. Do not copy Amazon product descriptions, Amazon reviews, Amazon star ratings, or Amazon logos.
6. Add original commentary to recommendations explaining why the item is helpful and who would enjoy it.

## Blog and resource content

Add posts to `data/blog.json`. Each post uses a `slug`, title, category, date, excerpt, reading time, and content paragraphs. Blog article links use `blog.html?post=slug`, which can be mapped to cleaner URLs with static-host redirects or rewrites if desired.

Add recommendations to `data/recommendations.json`. Every recommendation must include original `whyRecommended` and `whoWouldEnjoy` copy before the affiliate button.

Add testimonials or press placeholders to `data/testimonials.json`.

## SEO features

- Unique page titles and meta descriptions.
- Open Graph tags.
- Canonical URLs.
- Person, WebSite, Book, Blog, and BlogPosting structured data.
- Semantic landmarks, heading hierarchy, and descriptive link text.

## Accessibility and performance

- Mobile-first responsive layout.
- Keyboard-accessible navigation and skip link.
- High-contrast text on light backgrounds.
- Lazy-loaded images.
- Local SVG placeholders for fast loading.
- Reduced-motion support.

## Amazon Associates compliance audit

- [x] Affiliate disclosure exists site-wide and on a dedicated page.
- [x] Required statement appears prominently: "As an Amazon Associate I earn from qualifying purchases."
- [x] Every generated Amazon CTA includes a nearby affiliate disclosure.
- [x] Affiliate links use `rel="nofollow sponsored noopener"`.
- [x] Recommendations include original commentary and are not thin product listings.
- [x] No Amazon logos are used.
- [x] No copied Amazon product descriptions or reviews are included.
- [x] Website provides publishing information, blog posts, resources, and reader community value beyond affiliate links.
- [x] Responsive layout is implemented.
- [x] SEO metadata and structured data are implemented.
- [x] JSON content architecture supports future growth.
