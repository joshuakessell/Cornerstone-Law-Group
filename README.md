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

