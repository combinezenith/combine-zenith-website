// app/lib/auth.ts

export function validateAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("Admin credentials not set in environment variables.");
  }

  return email === adminEmail && password === adminPassword;
}
