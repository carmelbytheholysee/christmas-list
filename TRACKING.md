# Daily price and stock check

A scheduled Claude task runs once a day and follows these steps. It only ever rewrites `status.js`.

## Steps

1. Read `items.js` in the repository. For every item, go through its `watch` list.
2. Check each watched store for the exact variant described (`variant`, or the item name):
   - **No `method`, or `method: "fetch"`:** read the store page with WebFetch. Record the current price, the regular price if a sale is shown, and whether that variant can be added to the cart.
   - **`method: "search"`:** the store blocks automated page reads (Amazon, Target, Youth To The People, Apple). Use WebSearch for the product name plus the store, and take the price only from a result that clearly names that store and the right variant. Mark the price `approx: true`. Never try to get around a store's block (no scripts, mirrors, caches, or the person's browser).
   - Taylor Swift Store items are limited merch. Treat any sign of "Sold out," "Unavailable," or a missing Add to Cart button as `stock: "out"`.
3. For each item, build its entry for `status.js`:
   - `deal`: the lowest confirmed price below the item's regular `price` across all watched stores: `{ price, store, link, note?, approx? }`. Leave it out if nothing is cheaper. Use `note` to mention a second store with a similar price, or a store that's still at full price, in one plain sentence.
   - `stock`: one of `"in"`, `"low"`, `"out"`, `"backorder"`, or `"unknown"`, for the store in `deal` (or the item's main store if there's no deal). Use `"unknown"` when the check failed or the page doesn't say. Never guess.
   - If a check fails, keep yesterday's entry for that item rather than deleting it.
4. Write `status.js` in exactly the existing format, set `updated` to today's date (YYYY-MM-DD, America/New_York), then commit with the message `Daily price/stock check YYYY-MM-DD` and push.
5. Send Stewart a short summary only if something changed: a new sale, a sale that ended, or an item that sold out or came back. Name each item and the store. If nothing changed, send nothing.

## Limits

- The Google Sheet handles every item with a `shopify` field in `items.js` on its own every morning (listed in `shopify.json`) and holds Stewart's hand-entered Amazon prices. The site prefers those sheet prices over anything in `status.js`, so this task can skip those stores and any `store: "Amazon"` watch entry for items in the Manual Prices tab.
- Amazon blocks AI agents from reading its pages. For Amazon items without a hand-entered price, use search results, which can lag by a day or more. The site labels these "approx."
- The checker never touches `items.js`, never claims anything, and never buys anything.
