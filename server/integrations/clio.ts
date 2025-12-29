const CLIO_AUTHORIZE_URL = "https://app.clio.com/oauth/authorize";
const CLIO_TOKEN_URL = "https://app.clio.com/oauth/token";

const getEnv = (key: string) => process.env[key] ?? "";

export function isClioConfigured(): boolean {
  return Boolean(getEnv("CLIO_CLIENT_ID") && getEnv("CLIO_CLIENT_SECRET") && getEnv("CLIO_REDIRECT_URI"));
}

export function getAuthorizeUrl(state: string): string {
  if (!isClioConfigured()) {
    throw new Error("Clio OAuth is not configured. Set CLIO_CLIENT_ID, CLIO_CLIENT_SECRET, and CLIO_REDIRECT_URI.");
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: getEnv("CLIO_CLIENT_ID"),
    redirect_uri: getEnv("CLIO_REDIRECT_URI"),
    state,
  });

  const scopes = getEnv("CLIO_SCOPES");
  if (scopes) {
    params.set("scope", scopes);
  }

  return `${CLIO_AUTHORIZE_URL}?${params.toString()}`;
}

export { CLIO_TOKEN_URL };
