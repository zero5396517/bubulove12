# Stitch → uni-app (get_screen HTML) workflow

Use this after **Stitch MCP** is connected in Cursor ([Stitch MCP guide](https://stitch.withgoogle.com/docs/mcp/guide/)).

## 1. Discover screens

- Call **`list_screens`** with your **`projectId`** (from the design URL path `/projects/<id>/…`).
- If the URL has **no `node-id`**, you **must** take **`screenId`** from `list_screens` output — do not guess from the URL alone.

## 2. Pull each screen

- For each **`screenId`**, call **`get_screen`** with `projectId` + `screenId`.
- Read: `htmlCode.downloadUrl`, `screenshot.downloadUrl`, dimensions.

## 3. Download HTML reliably

GCS URLs often work better with a real HTTP client than inline fetch in chat.

**Git Bash / WSL / macOS / Linux:**

```bash
cd mobile-app
bash scripts/fetch-stitch.sh "<htmlCode.downloadUrl>" "design/stitch/screens/<slug>.html"
```

**Windows PowerShell:**

```powershell
cd mobile-app
.\scripts\fetch-stitch.ps1 -Url "<htmlCode.downloadUrl>" -Output "design\stitch\screens\<slug>.html"
```

Optional: copy `design/stitch/MANIFEST.example.json` → `MANIFEST.json` and record each `screenId` → `uniPage` → saved `htmlFile`.

## 4. Convert HTML → uView Pro (skill flow)

Do **not** paste Tailwind classes into `.vue` as-is. For each screen:

1. **Structure / forms**: stitch-html-patterns (in Cursor skill `stitch-uviewpro-components`).
2. **Tailwind → rpx / theme**: tailwind-to-uviewpro.
3. **Components & slots**: `contract.md` — `u-tabs`, `u-form`, `u-picker` (`v-model` + 1D `:range`), Vue 3 `#label` / `#suffix` / `#right`, etc.

Implement the matching page under `src/pages/...` and adjust `src/uni.scss` / tokens only when the design changes global colors.

## 5. Visual check

Open `screenshot.downloadUrl` (or local screenshot) side-by-side with the H5 build.

## 6. Fallback

If MCP is down, keep using **`example/ui.html`** + `src/styles/design-tokens.scss` as the design source.
