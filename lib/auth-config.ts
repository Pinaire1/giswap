type AuthEnvStatus = {
  secret: string | undefined;
  googleClientId: string | undefined;
  googleClientSecret: string | undefined;
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

  const missing: string[] = [];
  if (!secret) missing.push("AUTH_SECRET");
  if (!googleClientId) missing.push("GOOGLE_CLIENT_ID");
  if (!googleClientSecret) missing.push("GOOGLE_CLIENT_SECRET");

  return { secret, googleClientId, googleClientSecret, missing };
}

export function logAuthConfigIssues(): void {
  const { missing } = getAuthEnv();
  if (missing.length === 0) return;

  console.error(
    `[auth] Missing required environment variables: ${missing.join(", ")}. ` +
      "Sign-in will fail with a Configuration error until these are set in Vercel."
  );
}
