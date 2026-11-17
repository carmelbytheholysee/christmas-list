# Putting your Christmas list online

You need two free things: a **Google Sheet** that records claims, and a **GitHub Pages** site that shows the list. Plan on about 15 minutes.

## Files

| File | What it does |
|---|---|
| `index.html` | The storefront. You shouldn't need to touch it. |
| `items.js` | Your list and the backend URL. You edit this one. |
| `status.js` | Sale prices and stock, rewritten by the daily checker. Don't edit it by hand. |
| `Code.gs` | The claims backend. It goes into Google Apps Script. |

## 1. Set up the claims backend (Google Sheet)

1. Go to sheets.new and name the sheet something like "Christmas claims".
2. Open **Extensions → Apps Script**.
3. Delete the sample code in the editor, paste in all of `Code.gs`, and click **Save**.
4. Click **Deploy → New deployment**. Click the gear next to "Select type" and choose **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** and approve the permissions. Google will warn you the app is unverified. Click **Advanced → Go to (project name)**. The warning appears because you wrote the script yourself.
6. Copy the **Web app URL**, which ends in `/exec`.
7. Open `items.js` and paste it in as `window.CLAIMS_API = "https://script.google.com/macros/s/.../exec";`

The script creates a **Claims** tab the first time someone claims a gift. **Don't open that tab before Christmas**, since it shows who claimed what. Afterward it's a ready-made list for thank-you notes.

### 1b. Daily store prices and your own Amazon prices (free)

The same Google Sheet script also keeps prices fresh. It runs on Google's servers, so your computer can be off.

1. In the Apps Script editor, pick **setupDailyChecks** from the function dropdown at the top and click **Run**. Approve the new permission (it reads the store pages). It does three things:
   - creates a **Store Prices** tab with today's price and stock for the Taylor Swift towel, the Lover pillow, and the Transparent Labs pre-workout (Strawberry Lemonade, 30 servings), read from each store's public product data;
   - schedules that check for every morning around 6 a.m. Eastern;
   - creates a **Manual Prices** tab listing your four Amazon-only items.
2. Click **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. The site's URL stays the same. Without a new version, the old code keeps running.

Neither price tab shows who claimed what, so both are safe to open.

**Using the Manual Prices tab:** set up free CamelCamelCamel price watches for the four Amazon items. When an alert says a price dropped, type the price and the date into that item's row (column D is `in` or `out`, and you can leave it blank for in stock). The site picks it up within a minute. Prices older than 7 days stop showing, so a stale number never sits there through Christmas. To track another Amazon item by hand, add a row with its id from `items.js`.

**Adding another Shopify store item:** many brand stores run on Shopify. Add `.js` to the end of a product link. If the browser shows a page of data instead of an error, add the item to `SHOPIFY_ITEMS` in `Code.gs` (with the exact variant title if the product has sizes or flavors), then deploy a new version.

To stop after Christmas: in Apps Script, open **Triggers** (the alarm-clock icon) and remove the `updateStorePrices` trigger.

## 2. Put the site on GitHub Pages

1. Sign in at github.com (or make a free account) and create a new **public** repository, for example `christmas-list`.
2. Click **Add file → Upload files** and drag in `index.html`, `items.js`, and `status.js`, plus an `images/` folder if you're using your own photos. Commit.
3. Go to **Settings → Pages**. Under "Branch," pick **main** and **/(root)**, then **Save**.
4. After about a minute your site is live at `https://YOUR-USERNAME.github.io/christmas-list/`. That's the link to send people.

## 3. Turn on your own spoiler-free view

On each device you use, open your site once with `?owner` on the end:

`https://YOUR-USERNAME.github.io/christmas-list/?owner`

That browser will then show every item as available, with a gold "Owner view" bar at the top. To see what guests see, use the link in that bar or add `?guest`.

Caveats: owner view is a setting saved in that one browser, not a password. If you open the plain link on a new device, you'll see claims. Also, the public repository makes `items.js` readable by anyone. That's harmless, since claims live only in your Google Sheet.

## Changing the list later

Edit `items.js` on GitHub (click the file, then the pencil icon) and commit. The site updates within a minute or two.
- To add an item, give it a new, unique `id`.
- **Don't change an existing item's `id`**, or its claim will stop matching.
- To take an item off the list, delete its block from `items.js`.

## How claiming works

- A visitor taps **I'm getting this** and can add their name. That item then shows **No Longer Available** to everyone else, and it moves to the end of the list.
- Claims go through a lock, so two people can't claim the same gift at the same moment.
- The claimer can release a gift from the same device. Released claims stay in the sheet, marked `released`.
- The public site only sees which items are taken. Names are visible only in your sheet.
- If someone needs a claim released and has lost that device, open the Claims tab after Christmas (or ask someone else to) and change the status to `released`.
