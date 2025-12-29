# Clio OAuth scaffolding

This project includes a minimal Clio OAuth scaffold for future integration work.

## Environment variables

Set these in your runtime environment (see `.env.example`):

- `CLIO_CLIENT_ID`
- `CLIO_CLIENT_SECRET`
- `CLIO_REDIRECT_URI`
- `CLIO_SCOPES` (optional)

## Endpoints

- `GET /api/integrations/clio/status`  
  Returns `{ configured: boolean }`.

- `GET /api/integrations/clio/authorize`  
  Redirects to Clio OAuth authorize URL when configured. Returns 400 if not configured.

- `GET /api/integrations/clio/callback`  
  Placeholder endpoint. Returns a TODO response with the `code` when configured, or `Not implemented` if not.

## Next steps

- Exchange `code` for tokens at `https://app.clio.com/oauth/token`.
- Store tokens securely (database or secrets manager).
- Add refresh token handling and revoke flows.
