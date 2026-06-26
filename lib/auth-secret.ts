export function resolveAuthSecret(): string | undefined {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
}

export function requireAuthSecret(): string {
  const secret = resolveAuthSecret();
  if (!secret) {
    throw new Error(
      "Missing AUTH_SECRET (or NEXTAUTH_SECRET). Generate with: openssl rand -hex 32"
    );
  }
  return secret;
}
