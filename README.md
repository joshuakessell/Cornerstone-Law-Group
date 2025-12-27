# Cornerstone Intake Notes

## Templates
- Place intake templates under `server/templates`.
- Expected filenames: `<formType>.template.pdf` and `<formType>.fields.json` (1-indexed `page`, `x`, `y`, optional `size`/`lineHeight`/`color`).
- Provided form types: `basic-intake`, `divorce`, `modification`, `enforcement`, `adoption`, `mediation`, `marital-agreement`, `prenuptial-agreement`, `wills-trusts-estates`, `unsure`.
- Dev-only helper: `POST /api/client-intake/dev/convert-docx` converts DOCX from `client/public/documents` using `soffice --headless` and writes PDFs into `server/templates`. If LibreOffice is missing, the route returns a clear JSON error. Field maps remain manual.

## Generated uploads
- Artifacts are saved to `server/uploads/<sessionId>/<packetId>/<formType>/` with:
  - `filled.pdf` (overlay via pdf-lib + field map)
  - `answers.json`
  - `thumb.png` (first page via `pdftoppm`)
- Packet index lives at `server/uploads/<sessionId>/<packetId>/index.json` and lists `category`, `createdAt`, and `completedForms` (including URLs and `pageCount`).
- Uploads are served statically at `/uploads`.

## Email submission
- `POST /api/client-intake/sessions/:sessionId/packets/:packetId/submit` emails `jckessell@gmail.com` with Basic + category PDFs and JSON answers.
- Required env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`. Missing vars return HTTP 400 without crashing the server.

## Local prerequisites
- PDF overlay uses `pdf-lib` only.
- Thumbnails require Poppler's `pdftoppm` on PATH; errors are surfaced if the binary is missing.
- Template conversion route requires LibreOffice (`soffice`) on PATH.

