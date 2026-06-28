type AuthEnvStatus = {
  secret: string | undefined;
  googleClientId: string | undefined;
  googleClientSecret: string | undefined;
  authUrl: string | undefined;
  redirectProxyUrl: string | undefined;
  missing: string[];
};

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function getAuthEnv(): AuthEnvStatus {
  const secret = readEnv("AUTH_SECRET") ?? readEnv("NEXTAUTH_SECRET");
  const googleClientId = readEnv("GOOGLE_CLIENT_ID");
  const googleClientSecret = readEnv("GOOGLE_CLIENT_SECRET");
  const authUrl = readEnv("AUTH_URL") ?? readEnv("NEXTAUTH_URL");
  const redirectProxyUrl = readEnv("AUTH_REDIRECT_PROXY_URL");

  const missing: string[] = [];
  if (!secret) missing.push("AUTH_SECRET");
  if (!googleClientId) missing.push("GOOGLE_CLIENT_ID");
  if (!googleClientSecret) missing.push("GOOGLE_CLIENT_SECRET");

  return {
    secret,
    googleClientId,
    googleClientSecret,
    authUrl,
    redirectProxyUrl,
    missing,
  };
}

export function logAuthConfigIssues(): void {
  const { missing, authUrl, redirectProxyUrl } = getAuthEnv();

  if (missing.length > 0) {
    console.error(
      `[auth] Missing required environment variables: ${missing.join(", ")}. ` +
        "Sign-in will fail until these are set in Vercel."
    );
  }

  if (!authUrl) {
    console.warn(
      "[auth] AUTH_URL is not set. Set AUTH_URL=https://giswap.vercel.app in production " +
        "so OAuth cookies and callbacks use a stable domain."
    );
  }

  if (redirectProxyUrl) {
    console.info(`[auth] Preview redirect proxy enabled: ${redirectProxyUrl}`);
  }
}
