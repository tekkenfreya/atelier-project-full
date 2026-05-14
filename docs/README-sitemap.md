# Sitemap tracker

Project task tracker for Atelier Rusalka, generated from JSON.

## Files

| Path | Role |
|---|---|
| `docs/sitemap.json` | Source of truth — sections / pages / tasks |
| `docs/generate-sitemap.py` | Generator — reads JSON, writes XLSX |
| `docs/Atelier-Rusalka-Sitemap.xlsx` | The working tracker — open in Excel / Numbers / Sheets |

## How it works

The Excel file has two sheets:

- **Summary** — total task count + status breakdown + per-section progress
- **Sitemap** — one row per task, grouped by section + page; status / priority columns carry dropdowns; status colour follows the cell value automatically (Done = green, In progress = yellow, Todo = grey, Blocked = red)

## Adding a new task or page

1. Open `docs/sitemap.json`.
2. Add the task under the right page (or add a new page under a section, or a new section).
3. Regenerate:

   ```bash
   python3 docs/generate-sitemap.py
   ```

> The script **overwrites** the .xlsx — any manual edits you made in Excel are lost on regenerate. Only re-run when you've added structural changes that need to be picked up.

## Updating status / owner / notes

Edit the **Excel file directly** — that's the working tracker. The JSON only owns structure.

If you want the JSON to reflect updated statuses, edit them there too and regenerate — but most teams just let the Excel drift from the JSON.

## Schema

```json
{
  "metadata": {
    "status_values":   ["Todo", "In progress", "Done", "Blocked", "Skipped", "N/A"],
    "priority_values": ["P0 critical", "P1 high", "P2 medium", "P3 low"]
  },
  "sections": [
    {
      "name": "Marketing flow",
      "pages": [
        {
          "label": "Home",
          "path": "/",
          "description": "Hero · featured · subscription · footer",
          "tasks": [
            { "name": "Promo bar", "status": "Done", "priority": "P1 high", "owner": "", "notes": "" }
          ]
        }
      ]
    }
  ]
}
```

Fields beyond `name` on a task are optional. Missing `status` defaults to "Todo".

## Dependencies

```bash
pip3 install --user openpyxl
```

Tested with `openpyxl 3.1.x`.
