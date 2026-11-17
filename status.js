// Written by the daily price and stock checker. Hand edits get overwritten.
// deal:  a lower price somewhere. { price, store, link, note }
// stock: "in" | "low" | "out" | "backorder" | "unknown"  (for the exact variant wanted)
// approx: true when the price came from search results instead of the store page
window.STATUS = {
  updated: "2026-11-16",
  items: {
    "apple-watch-series-12": {
      deal: { price: 329, store: "Best Buy", link: "https://www.bestbuy.com/site/6572728.p", note: "Target has it for $329.99. Apple charges the full $399." },
      stock: "in",
    },
    "ts-checker-game-towel": { stock: "in" },
    "ts-lover-house-pillow": { stock: "in" },
    "ts-ttpd-beige-hoodie": {
      deal: { price: 65.25, store: "Taylor Swift Store", link: "https://store.taylorswift.com/products/the-tortured-poets-department-beige-hoodie?variant=43295303729352" },
      stock: "in",
    },
    "nutricost-multivitamin-men": {
      deal: { price: 12.71, store: "Amazon", link: "https://www.amazon.com/dp/B06WP6KQKH", approx: true },
    },
    "nutricost-preworkout-complex": {
      deal: { price: 27.16, store: "Amazon", link: "https://www.amazon.com/dp/B0CNKW7KFB", approx: true },
    },
    "book-didion-and-babitz": {
      deal: { price: 27.95, store: "Bookshop.org", link: "https://bookshop.org/book/9781668065488" },
      stock: "in",
    },
    "book-play-it-as-it-lays": {
      deal: { price: 16.78, store: "Bookshop.org", link: "https://bookshop.org/book/9780374529949" },
      stock: "in",
    },
    "book-democracy": {
      deal: { price: 16.78, store: "Bookshop.org", link: "https://bookshop.org/book/9780679754855" },
      stock: "in",
    },
    "book-miami": {
      deal: { price: 16.78, store: "Bookshop.org", link: "https://bookshop.org/book/9780679781806" },
      stock: "backorder",
    },
    "book-slow-days-fast-company": {
      deal: { price: 16.73, store: "Bookshop.org", link: "https://bookshop.org/book/9781681370088" },
      stock: "in",
    },
  },
};
