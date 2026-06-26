export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error(
      "Missing AUTH_SECRET (or NEXTAUTH_SECRET). Generate with: openssl rand -hex 32"
    );
  }
  return secret;
}
