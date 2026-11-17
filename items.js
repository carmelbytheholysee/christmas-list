// ============================================================
//  YOUR LIST: edit this file to change what's on the site.
// ============================================================
//
//  id       unique, letters/numbers/dashes. Never change an id after
//           people start claiming, or that claim is lost.
//  price    regular price (number), or null if unknown/varies.
//  approx   true when the price came from search results, not the store page.
//  image    direct image URL, or a file in images/ (e.g. "images/towel.jpg").
//  link     main store (Amazon when it exists). altLink = backup store.
//  vendor / altVendor   optional, overrides the store name on the button.
//  priority "top" adds a Top pick ribbon.
//  watch    what the daily checker looks at (see TRACKING.md). Sales and
//           stock it finds go into status.js, not here.

window.CLAIMS_API = "https://script.google.com/macros/s/AKfycbwaXVxZAhiX108d5yLkrscUDeePGE2bMOIvDLI7n3Uq97iP8pm4bAzb1AoCbYz0qWXlbQ/exec"; // ← paste your Google Apps Script web app URL here (see SETUP.md)

const UQ_LINK = (c) =>
  `https://www.uniqlo.com/us/en/products/E454326-000/00?colorDisplayCode=${c}&sizeDisplayCode=004`;
const UQ_IMG = (c) =>
  `https://image.uniqlo.com/UQ/ST3/WesternCommon/imagesgoods/454326/item/goods_${c}_454326_3x4.jpg`;
const uniqlo = (code, color) => ({
  id: `uniqlo-airism-boxer-${color.toLowerCase().replace(/\s+/g, "-")}`,
  name: `Uniqlo AIRism Boxer Briefs, ${color}`,
  price: 14.9,
  category: "Clothing",
  description:
    "Men's size M. I'd like several pairs, so each color is its own item. Grab one color or a few.",
  image: UQ_IMG(code),
  link: UQ_LINK(code),
  watch: [{ store: "Uniqlo", url: UQ_LINK(code), check: "price+stock", variant: `${color}, size M` }],
});

window.WISHLIST = {
  owner: "Stewart",
  title: "Stewart's Christmas List",
  intro:
    "Browse, pick something, and tap “I'm getting this.” It disappears for everyone else so nobody doubles up. Sale tags are checked daily.",
  items: [
    {
      id: "apple-watch-series-12",
      name: "Apple Watch Series 12, 42mm GPS, Black Aluminum with Black Sport Band (S/M)",
      price: 399,
      category: "Tech",
      description:
        "42mm, GPS (no cellular), black aluminum case, black sport band in S/M. Apple sells it at full price; Best Buy and Target have it on sale.",
      image:
        "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/b27d0b18-20cf-4f89-bf36-6d2cafc2750d.jpg",
      link: "https://www.bestbuy.com/site/6572728.p",
      altLink: "https://www.target.com/p/apple-watch-series-12/-/A-1013556561?preselect=91122673",
      priority: "top",
      watch: [
        { store: "Best Buy", url: "https://www.bestbuy.com/site/6572728.p", check: "price+stock" },
        { store: "Target", url: "https://www.target.com/p/apple-watch-series-12/-/A-1013556561?preselect=91122673", check: "price", method: "search" },
        { store: "Apple", url: "https://www.apple.com/shop/buy-watch/apple-watch", check: "price", method: "search" },
      ],
    },
    {
      id: "ts-checker-game-towel",
      name: "Taylor Swift Checker Game Towel",
      price: 65,
      category: "Taylor Swift",
      description:
        "70\" × 35\" woven cotton towel with a checkerboard pattern. It comes with 24 navy and cream checkers and a strap with a netting bag. Official store only.",
      image:
        "https://store.taylorswift.com/cdn/shop/files/vlNqFOZCJwEYURlz6SgXNqLLdbg600ed-2.png?v=1763060937",
      link: "https://store.taylorswift.com/products/taylor-swift-checker-game-towel",
      vendor: "Taylor Swift Store",
      priority: "top",
      watch: [{ store: "Taylor Swift Store", url: "https://store.taylorswift.com/products/taylor-swift-checker-game-towel", check: "price+stock" }],
    },
    {
      id: "ts-lover-house-pillow",
      name: "Lover House Corduroy Pillow",
      price: 45,
      category: "Taylor Swift",
      description:
        "18\" × 18\" pillow with a multicolor corduroy front, red velvet piping, and a red velvet back. From the official Taylor Swift store.",
      image:
        "https://store.taylorswift.com/cdn/shop/files/01_HOLIDAY26_Lover_8385312450_LAYFLAT_001_R1.webp?v=1794583664",
      link: "https://store.taylorswift.com/products/lover-house-corduroy-pillow",
      vendor: "Taylor Swift Store",
      watch: [{ store: "Taylor Swift Store", url: "https://store.taylorswift.com/products/lover-house-corduroy-pillow", check: "price+stock" }],
    },
    {
      id: "yttp-superfood-cleanser-refill",
      name: "Youth To The People Superfood Cleanser, 16.9 oz Refill Pouch",
      price: 68,
      approx: true,
      category: "Skincare",
      description:
        "The 16.9 oz refill pouch, not the 8 oz bottle. It refills the pump bottle I already have.",
      image: "",
      link: "https://www.youthtothepeople.com/skincare/cleansers/superfood-cleanser/YTTP-10100.html?dwvar_YTTP-10100_size=16.9oz%20Refill",
      vendor: "Youth To The People",
      altLink: "https://www.sephora.com/product/P411387",
      watch: [
        { store: "Youth To The People", url: "https://www.youthtothepeople.com/skincare/cleansers/superfood-cleanser/YTTP-10100.html", check: "price", method: "search", variant: "16.9 oz Refill" },
        { store: "Sephora", url: "https://www.sephora.com/product/P411387", check: "price", variant: "Refill size" },
      ],
    },
    uniqlo("09", "Black"),
    uniqlo("05", "Gray"),
    uniqlo("69", "Navy"),
    uniqlo("66", "Blue"),
    uniqlo("38", "Dark Brown"),
    {
      id: "nutricost-multivitamin-men",
      name: "Nutricost Multivitamin for Men, 120 Capsules",
      price: 19.95,
      approx: true,
      category: "Fitness",
      description: "The 120-capsule bottle.",
      image: "",
      link: "https://www.amazon.com/dp/B06WP6KQKH",
      watch: [{ store: "Amazon", url: "https://www.amazon.com/dp/B06WP6KQKH", check: "price", method: "search" }],
    },
    {
      id: "nutricost-preworkout-complex",
      name: "Nutricost Pre-Workout Complex, Blue Raspberry, 60 Servings",
      price: 31.95,
      approx: true,
      category: "Fitness",
      description: "Blue Raspberry flavor, 60 servings.",
      image: "",
      link: "https://www.amazon.com/dp/B0CNKW7KFB",
      watch: [{ store: "Amazon", url: "https://www.amazon.com/dp/B0CNKW7KFB", check: "price", method: "search" }],
    },
    {
      id: "glidapex-record-wall-mounts",
      name: "Glidapex Vinyl Record Wall Mounts, 6-Pack, Walnut",
      price: null,
      category: "Home",
      description:
        "Six solid-wood ledges for displaying records on the wall. They mount with the included adhesive strips, so no drilling.",
      image: "",
      link: "https://www.amazon.com/dp/B0H883DZQ5",
      watch: [{ store: "Amazon", url: "https://www.amazon.com/dp/B0H883DZQ5", check: "price", method: "search" }],
    },
    {
      id: "pitpet-automatic-cat-feeder",
      name: "PitPet Smart Automatic Cat Feeder, 6L, White",
      price: null,
      category: "Home",
      description: "6-liter automatic feeder with an LCD screen for scheduling meals. Wirecutter pick.",
      image: "",
      link: "https://www.amazon.com/dp/B0BRJVZBF8",
      watch: [{ store: "Amazon", url: "https://www.amazon.com/dp/B0BRJVZBF8", check: "price", method: "search" }],
    },
    {
      id: "mzoo-sleep-mask",
      name: "MZOO Contoured Sleep Mask, Black",
      price: 16.99,
      approx: true,
      category: "Home",
      description:
        "Memory-foam sleep mask with deep eye cups, so there's no pressure on the eyes. It blocks all light and works for side sleepers. Wirecutter pick.",
      image: "",
      link: "https://www.amazon.com/dp/B07KC5DWCC",
      watch: [{ store: "Amazon", url: "https://www.amazon.com/dp/B07KC5DWCC", check: "price", method: "search" }],
    },
    {
      id: "book-didion-and-babitz",
      name: "Didion and Babitz, by Lili Anolik (Hardcover)",
      price: 29.99,
      category: "Books",
      description: "Hardcover, Scribner, 2024.",
      image: "https://images-us.bookshop.org/ingram/9781668065488.jpg?width=600",
      link: "https://bookshop.org/book/9781668065488",
      altLink: "https://www.amazon.com/dp/1668065487",
      watch: [{ store: "Bookshop.org", url: "https://bookshop.org/book/9781668065488", check: "price+stock" }],
    },
    {
      id: "book-play-it-as-it-lays",
      name: "Play It As It Lays, by Joan Didion (Paperback)",
      price: 18,
      category: "Books",
      description: "FSG paperback with the David Thomson introduction.",
      image: "https://images-us.bookshop.org/ingram/9780374529949.jpg?width=600",
      link: "https://bookshop.org/book/9780374529949",
      altLink: "https://www.amazon.com/dp/0374529949",
      watch: [{ store: "Bookshop.org", url: "https://bookshop.org/book/9780374529949", check: "price+stock" }],
    },
    {
      id: "book-democracy",
      name: "Democracy, by Joan Didion (Paperback)",
      price: 18,
      category: "Books",
      description: "Vintage International paperback.",
      image: "https://images-us.bookshop.org/ingram/9780679754855.jpg?width=600",
      link: "https://bookshop.org/book/9780679754855",
      altLink: "https://www.amazon.com/dp/0679754857",
      watch: [{ store: "Bookshop.org", url: "https://bookshop.org/book/9780679754855", check: "price+stock" }],
    },
    {
      id: "book-miami",
      name: "Miami, by Joan Didion (Paperback)",
      price: 18,
      category: "Books",
      description: "Vintage International paperback.",
      image: "https://images-us.bookshop.org/ingram/9780679781806.jpg?width=600",
      link: "https://bookshop.org/book/9780679781806",
      altLink: "https://www.amazon.com/dp/0679781803",
      watch: [{ store: "Bookshop.org", url: "https://bookshop.org/book/9780679781806", check: "price+stock" }],
    },
    {
      id: "book-slow-days-fast-company",
      name: "Slow Days, Fast Company, by Eve Babitz (Paperback)",
      price: 17.95,
      category: "Books",
      description: "NYRB Classics paperback with the Matthew Specktor introduction.",
      image: "https://images-us.bookshop.org/ingram/9781681370088.jpg?width=600",
      link: "https://bookshop.org/book/9781681370088",
      altLink: "https://www.amazon.com/dp/1681370085",
      watch: [{ store: "Bookshop.org", url: "https://bookshop.org/book/9781681370088", check: "price+stock" }],
    },
  ],
};
