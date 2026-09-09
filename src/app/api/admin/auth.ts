// src/app/api/admin/auth.ts
export function checkBasicAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization') ?? '';
  if (!authHeader.startsWith('Basic ')) return false;
  const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
  const colonIndex = decoded.indexOf(':');
  if (colonIndex === -1) return false;
  const user = decoded.slice(0, colonIndex);
  const pass = decoded.slice(colonIndex + 1);
  return (
    user === process.env.ADMIN_BASIC_AUTH_USERNAME &&
    pass === process.env.ADMIN_BASIC_AUTH_PASSWORD
  );
}
