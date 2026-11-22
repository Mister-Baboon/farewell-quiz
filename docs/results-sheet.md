# Saving results to a Google Sheet

When a player finishes every round, the app POSTs their results to a Google
Apps Script web app, which writes one row per player (re-sending overwrites).

## Setup

1. Create a Google Sheet. Extensions → Apps Script. Paste:

```js
const HEADERS = ["Игрок", "Завершено", "Верно", "Всего"];

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  // One column per category: "Музыка" etc.
  d.categories.forEach((c, i) => {
    sheet.getRange(1, HEADERS.length + 1 + i).setValue(c.title);
  });

  const row = [d.player, d.finishedAt, d.correct, d.total]
    .concat(d.categories.map((c) => c.correct));

  const names = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
  let r = names.findIndex((n) => n[0] === d.player);
  r = r === -1 ? sheet.getLastRow() + 1 : r + 2;
  sheet.getRange(r, 1, 1, row.length).setValues([row]);
  return ContentService.createTextOutput("ok");
}
```

2. Deploy → New deployment → type **Web app**, Execute as **Me**,
   Who has access **Anyone**. Copy the `.../exec` URL.
3. GitHub repo → Settings → Secrets and variables → Actions → **Variables** →
   new variable `RESULTS_URL` = that URL. Re-run the Deploy workflow.

Locally: `NEXT_PUBLIC_RESULTS_URL=<url> npm run dev`. Without it nothing is sent.
After editing the script, create a **new deployment version** for changes to apply.
