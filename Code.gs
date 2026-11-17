/**
 * Christmas list claims backend (Google Apps Script).
 * Paste this whole file into Extensions → Apps Script in a new Google Sheet.
 *
 * The sheet tab "Claims" records each claim: item id, claimer's name,
 * a private token (so only the claimer's device can release it), the time,
 * and a status of "claimed" or "released". Rows are never removed; a release
 * just flips the status, so you keep a full history for thank-you notes.
 *
 * The public GET only returns which item ids are taken (never names), plus the
 * "Store Prices", "Manual Prices", and "Top Picks" tabs, which hold no personal information.
 */

const TAB = 'Claims';

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(TAB);
  if (!sh) {
    sh = ss.insertSheet(TAB);
    sh.appendRow(['itemId', 'name', 'token', 'time', 'status']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function rows_() {
  const sh = sheet_();
  const n = sh.getLastRow();
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, 5).getValues().map((r, i) => ({
    row: i + 2, id: String(r[0]), name: r[1], token: String(r[2]), status: r[4],
  }));
}

function claimedIds_() {
  return [...new Set(rows_().filter(r => r.status === 'claimed').map(r => r.id))];
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json_({ claimed: claimedIds_(), prices: prices_(), topPicks: topPicks_() });
}

/* ================================================================
 *  PRICES: free daily store checks + prices you type in by hand
 * ================================================================ */

// Backup list, used only if shopify.json on the site can't be loaded.
// Shopify stores publish product data at <product link>.js. Each entry:
// site item id → that URL, plus the exact variant title when the product has options.
const SHOPIFY_ITEMS = {
  'ts-checker-game-towel': {
    store: 'Taylor Swift Store',
    url: 'https://store.taylorswift.com/products/taylor-swift-checker-game-towel.js',
  },
  'ts-lover-house-pillow': {
    store: 'Taylor Swift Store',
    url: 'https://store.taylorswift.com/products/lover-house-corduroy-pillow.js',
  },
};

// Items you update by hand (e.g. from CamelCamelCamel alert emails). Listed in the Manual Prices tab.
const MANUAL_ITEMS = [
  'nutricost-multivitamin-men',
  'nutricost-preworkout-complex',
  'glidapex-record-wall-mounts',
  'pitpet-automatic-cat-feeder',
  'mzoo-sleep-mask',
];

const STORE_TAB = 'Store Prices';
const MANUAL_TAB = 'Manual Prices';
const MANUAL_MAX_AGE_DAYS = 7; // older manual prices stop showing on the site
const TZ = 'America/New_York';

function today_() { return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'); }

// The site publishes its own list of Shopify items, so new items need no changes here.
const SITE_SHOPIFY_LIST = 'https://carmelbytheholysee.github.io/christmas-list/shopify.json';

function shopifyItems_() {
  try {
    const res = UrlFetchApp.fetch(SITE_SHOPIFY_LIST + '?t=' + Date.now(), { muteHttpExceptions: true });
    if (res.getResponseCode() === 200) {
      const list = JSON.parse(res.getContentText());
      if (list && Object.keys(list).length) return list;
    }
  } catch (err) { console.log('Using built-in list: ' + err); }
  return SHOPIFY_ITEMS; // fallback if the site can't be reached
}

/** Runs every morning (see setupDailyChecks). Reads each Shopify product and writes the Store Prices tab. */
function updateStorePrices() {
  const items = shopifyItems_();
  const rows = Object.keys(items).map(id => {
    const cfg = items[id];
    try {
      const res = UrlFetchApp.fetch(cfg.url, { muteHttpExceptions: true, followRedirects: true });
      if (res.getResponseCode() === 404) return [id, cfg.store, '', '', 'out', today_(), 'product page removed'];
      if (res.getResponseCode() !== 200) return [id, cfg.store, '', '', 'unknown', today_(), 'HTTP ' + res.getResponseCode()];
      const p = JSON.parse(res.getContentText());
      const variants = p.variants || [];
      const v = cfg.variant ? variants.find(x => x.title === cfg.variant) : variants[0];
      if (!v) return [id, cfg.store, '', '', 'unknown', today_(), 'variant not found: ' + cfg.variant];
      const price = v.price / 100;
      const was = v.compare_at_price && v.compare_at_price > v.price ? v.compare_at_price / 100 : '';
      return [id, cfg.store, price, was, v.available ? 'in' : 'out', today_(), ''];
    } catch (err) {
      return [id, cfg.store, '', '', 'unknown', today_(), String(err).slice(0, 120)];
    }
  });
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(STORE_TAB) || ss.insertSheet(STORE_TAB);
  sh.clearContents(); // replaces yesterday's results with today's
  sh.getRange(1, 1, 1, 7).setValues([['itemId', 'store', 'price', 'wasPrice', 'stock', 'checked', 'problem']]);
  if (rows.length) sh.getRange(2, 1, rows.length, 7).setValues(rows);
  sh.setFrozenRows(1);
  console.log('Checked ' + rows.length + ' store items.');
}

function dateStr_(v) {
  return v instanceof Date ? Utilities.formatDate(v, TZ, 'yyyy-MM-dd') : String(v || '').trim();
}

function prices_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const out = {};
  const store = ss.getSheetByName(STORE_TAB);
  if (store && store.getLastRow() > 1) {
    store.getRange(2, 1, store.getLastRow() - 1, 6).getValues().forEach(r => {
      if (!r[0]) return;
      out[r[0]] = { store: r[1], price: r[2] === '' ? null : Number(r[2]), was: r[3] === '' ? null : Number(r[3]),
                    stock: r[4] || 'unknown', checked: dateStr_(r[5]), source: 'store' };
    });
  }
  const manual = ss.getSheetByName(MANUAL_TAB);
  if (manual && manual.getLastRow() > 1) {
    const cutoff = new Date(Date.now() - MANUAL_MAX_AGE_DAYS * 864e5);
    manual.getRange(2, 1, manual.getLastRow() - 1, 5).getValues().forEach(r => {
      const id = String(r[0] || '').trim(), price = Number(r[2]), when = r[4];
      if (!id || !(price > 0) || !when) return;
      const d = when instanceof Date ? when : new Date(when);
      if (isNaN(d) || d < cutoff) return;
      out[id] = { store: String(r[1] || 'Amazon'), price: price, was: null,
                  stock: String(r[3] || 'in').toLowerCase(), checked: dateStr_(when), source: 'manual' };
    });
  }
  return out;
}

/** Run once by hand: creates the Manual Prices tab, checks store prices now, and schedules the daily check. */
function setupDailyChecks() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName(MANUAL_TAB)) {
    const sh = ss.insertSheet(MANUAL_TAB);
    sh.getRange(1, 1, 1, 5).setValues([['itemId', 'store', 'price', 'stock (in/out)', 'date seen']]);
    sh.getRange(2, 1, MANUAL_ITEMS.length, 2).setValues(MANUAL_ITEMS.map(id => [id, 'Amazon']));
    sh.setFrozenRows(1);
    sh.getRange('E2:E').setNumberFormat('yyyy-mm-dd');
    sh.autoResizeColumns(1, 5);
  }
  updateStorePrices();
  const exists = ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'updateStorePrices');
  if (!exists) {
    ScriptApp.newTrigger('updateStorePrices').timeBased().everyDays(1).atHour(6).inTimezone(TZ).create();
  }
  console.log('Store Prices updated; daily check ' + (exists ? 'was already' : 'is now') + ' scheduled for ~6 a.m. Eastern.');
}

/* ================================================================
 *  TOP PICKS: set from the site's owner view, protected by a PIN.
 *  Set the PIN in Project Settings → Script Properties as OWNER_PIN.
 * ================================================================ */
const TOP_TAB = 'Top Picks';

function topSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(TOP_TAB);
  if (!sh) {
    sh = ss.insertSheet(TOP_TAB);
    sh.appendRow(['itemId', 'topPick', 'changed']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function topPicks_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TOP_TAB);
  if (!sh || sh.getLastRow() < 2) return {};
  const out = {};
  sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues().forEach(r => {
    if (r[0]) out[String(r[0])] = r[1] === true || String(r[1]).toUpperCase() === 'TRUE';
  });
  return out;
}

function setTop_(id, top, pin) {
  const expected = PropertiesService.getScriptProperties().getProperty('OWNER_PIN');
  if (!expected) return json_({ ok: false, reason: 'no-pin-set' });
  if (!id || pin !== expected) return json_({ ok: false, reason: 'wrong-pin' });
  const sh = topSheet_();
  const n = sh.getLastRow();
  const ids = n > 1 ? sh.getRange(2, 1, n - 1, 1).getValues().map(r => String(r[0])) : [];
  const i = ids.indexOf(id);
  if (i >= 0) sh.getRange(i + 2, 2, 1, 2).setValues([[top, new Date()]]);
  else sh.appendRow([id, top, new Date()]);
  return json_({ ok: true, topPicks: topPicks_() });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // one claim at a time, so two people can't grab the same gift
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const id = String(body.id || '').slice(0, 100);
    const token = String(body.token || '').slice(0, 100);

    if (body.action === 'setTop') return setTop_(id, body.top === true, String(body.pin || ''));
    if (!id || !token) return json_({ ok: false, reason: 'bad-request', claimed: claimedIds_() });

    const sh = sheet_();
    const active = rows_().filter(r => r.id === id && r.status === 'claimed');

    if (body.action === 'claim') {
      if (active.length) return json_({ ok: false, reason: 'taken', claimed: claimedIds_() });
      const name = String(body.name || '').slice(0, 60);
      sh.appendRow([id, name, token, new Date(), 'claimed']);
      return json_({ ok: true, claimed: claimedIds_() });
    }

    if (body.action === 'unclaim') {
      const mine = active.find(r => r.token === token);
      if (!mine) return json_({ ok: false, reason: 'not-yours', claimed: claimedIds_() });
      sh.getRange(mine.row, 5).setValue('released');
      return json_({ ok: true, claimed: claimedIds_() });
    }

    return json_({ ok: false, reason: 'unknown-action', claimed: claimedIds_() });
  } finally {
    lock.releaseLock();
  }
}
