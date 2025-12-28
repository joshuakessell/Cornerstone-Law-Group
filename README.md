# Cornerstone Intake Notes

## PDF Generation Modes

The intake system supports three PDF generation modes controlled by the `INTAKE_PDF_MODE` environment variable:

- **`auto`** (default): Automatically chooses between template overlay and summary generation:
  - If `server/templates/<formType>.template.pdf` and `<formType>.fields.json` exist, uses template overlay mode.
  - Otherwise, generates a clean "Intake Summary" PDF from scratch with all collected information.
- **`template`**: Requires both template PDF and fields map. Returns HTTP 400 if either is missing.
- **`summary`**: Always generates a summary PDF, regardless of template availability.

**Template mode** requires:
- `server/templates/<formType>.template.pdf`
- `server/templates/<formType>.fields.json`

**Summary mode** requires nothing and is recommended to launch quickly without template setup.

## Templates
- Place intake templates under `server/templates`.
- Expected filenames: `<formType>.template.pdf` and `<formType>.fields.json` (1-indexed `page`, `x`, `y`, optional `size`/`lineHeight`/`color`).
- Provided form types: `basic-intake`, `divorce`, `modification`, `enforcement`, `adoption`, `mediation`, `marital-agreement`, `prenuptial-agreement`, `wills-trusts-estates`, `unsure`.
- Dev-only helper: `POST /api/client-intake/dev/convert-docx` converts DOCX from `client/public/documents` using `soffice --headless` and writes PDFs into `server/templates`. If LibreOffice is missing, the route returns a clear JSON error. Field maps remain manual.

## Generated uploads
- Artifacts are saved to `server/uploads/<sessionId>/<packetId>/<formType>/` with:
  - `filled.pdf` (generated via template overlay or summary mode)
  - `answers.json`
  - `thumb.png` (first page via `pdftoppm`, optional - missing thumbnails are handled gracefully)
- Packet index lives at `server/uploads/<sessionId>/<packetId>/index.json` and lists `category`, `createdAt`, and `completedForms` (including URLs, `pageCount`, and `pdfMode`).
- Uploads are served statically at `/uploads`.

## Email submission
- `POST /api/client-intake/sessions/:sessionId/packets/:packetId/submit` emails `jckessell@gmail.com` with Basic + category PDFs and JSON answers.
- Required env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`. Missing vars return HTTP 400 without crashing the server.

## Local prerequisites
- PDF generation uses `pdf-lib` only (works for both template overlay and summary modes).
- Thumbnails require Poppler's `pdftoppm` on PATH but are optional - form completion will succeed even if thumbnail generation fails. The UI displays a placeholder icon when thumbnails are missing.
- Template conversion route requires LibreOffice (`soffice`) on PATH.

## Crawling + Pre-rendering

The application uses pre-rendering to make marketing pages readable without JavaScript for better SEO and crawler support.

### Pre-rendered Routes

The following public marketing routes are pre-rendered at build time:
- `/` (Home)
- `/our-approach`
- `/our-team`
- `/services`
- `/contact`
- `/client-portal`

These routes generate static HTML files that include the full page content in the initial HTML response, making them readable by search engine crawlers and accessible without JavaScript.

### SEO Files

- **robots.txt**: Located at `client/public/robots.txt`, allows all crawlers and points to the sitemap.
- **sitemap.xml**: Located at `client/public/sitemap.xml`, lists all crawlable public routes with priorities and change frequencies.

Both files are automatically copied to the build output during the Vite build process.

### Environment Variables

For production builds, set these environment variables:

- `VITE_SITE_ORIGIN`: The canonical site URL (e.g., `https://cornerstone-law-group.replit.app`). Used for canonical URLs and Open Graph tags. Defaults to the Replit domain if not set.
- `VITE_CLIO_CLIENT_PORTAL_URL`: The Clio for Clients portal login URL. Defaults to `https://clients.clio.com/login` if not set.

### Build Process

**Prerequisites**: Playwright browsers must be installed before building:
```bash
npx playwright install chromium
```
Alternatively, you can use:
```bash
pnpm exec playwright install chromium
```

The build process automatically pre-renders marketing routes:

```bash
pnpm build
```

This will:
1. Build the Vite client application
2. Start a temporary static server
3. Use Playwright to render each route and capture the HTML
4. Save pre-rendered HTML files to `dist/public/<route>/index.html`
5. Stop the temporary server
6. Build the Express server

### Running in Production

```bash
pnpm start
```

The server will:
- Serve pre-rendered HTML for marketing routes (so crawlers get actual content)
- Fall back to SPA mode (index.html) for authenticated/interactive routes
- Serve robots.txt and sitemap.xml from the site root

### Verification

To verify that pre-rendered HTML files exist and contain meaningful content:

```bash
pnpm verify:prerender
```

This checks that:
- All expected HTML files exist
- Each file contains expected headings/text
- Root divs contain rendered content (not just empty placeholders)
- Meta tags are present

### Testing Pre-rendered Content

To verify a route returns pre-rendered HTML (not just a shell):

```bash
curl https://your-domain.com/our-team
```

You should see HTML containing actual page content (headings, text, etc.) rather than just `<div id="root"></div>`.

### How It Works

1. **Build time**: Playwright renders each marketing route by loading the built SPA in a headless browser and capturing the fully-rendered HTML.
2. **Runtime**: The Express server checks if a pre-rendered HTML file exists for the requested route:
   - If yes: serves the pre-rendered HTML (crawlers get real content)
   - If no: serves the SPA index.html (for client-side routing)
3. **Meta tags**: Each page uses `react-helmet-async` to set page-specific meta tags (title, description, canonical URL, Open Graph tags) that are included in the pre-rendered HTML.

### Client Portal

The `/client-portal` route provides a landing page that directs users to the Clio for Clients portal. Set `VITE_CLIO_CLIENT_PORTAL_URL` (or `NEXT_PUBLIC_CLIO_CLIENT_PORTAL_URL`) to customize the portal login URL.

## Environment Variables

Vite is configured with `envPrefix: ["VITE_", "NEXT_PUBLIC_"]`, so either prefix works.

### Base keys
- `{PREFIX}CLIO_SCHEDULER_URL`
- `{PREFIX}CLIO_CLIENT_PORTAL_URL` (defaults to `https://clients.clio.com/login`)
- `{PREFIX}LAWPAY_URL`
- `{PREFIX}CLIO_GROW_INTAKE_BASE_URL`

### Optional per-practice overrides (highest precedence)
- `{PREFIX}CLIO_GROW_INTAKE_DIVORCE_URL`
- `{PREFIX}CLIO_GROW_INTAKE_CHILD_CUSTODY_PARENTING_PLANS_URL`
- `{PREFIX}CLIO_GROW_INTAKE_MODIFICATION_ENFORCEMENT_URL`
- `{PREFIX}CLIO_GROW_INTAKE_MEDIATION_URL`
- `{PREFIX}CLIO_GROW_INTAKE_COLLABORATIVE_LAW_URL`
- `{PREFIX}CLIO_GROW_INTAKE_PRENUPTIAL_MARITAL_AGREEMENTS_URL`
- `{PREFIX}CLIO_GROW_INTAKE_ADOPTION_URL`
- `{PREFIX}CLIO_GROW_INTAKE_WILLS_TRUSTS_ESTATES_URL`
- `{PREFIX}CLIO_GROW_INTAKE_GENERAL_URL` (optional)

### Precedence
1) Use per-practice override if set  
2) Else use `CLIO_GROW_INTAKE_BASE_URL` if set  
3) Else hide/replace the intake CTA (production)  

### Demo mode
- Set URLs to `/demo/...` to use internal demo flows.
- In development, missing scheduler/intake/pay URLs automatically fall back to `/demo/scheduler`, `/demo/intake`, and `/demo/pay`.
- In production, missing values remain `null` and CTAs fall back to contact/call guidance.

### Demo routes
- `/demo/scheduler` — booking simulator with localStorage history
- `/demo/intake` and `/demo/intake/:practice` — safe intake preview for each practice slug
- `/demo/pay` — mock payment flow (no card entry)

### Local development
- Install: `pnpm install`
- Terminal 1 (server + API): `pnpm dev`
- Terminal 2 (client-only, optional split): `pnpm dev:client` (Vite on port 5000)
- In dev, demo integrations auto-fill if env vars are absent.
