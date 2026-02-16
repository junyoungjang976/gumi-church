import { cookies } from 'next/headers'

const ADMIN_COOKIE = 'church-admin-token'

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'church-salt-2024')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyAdmin(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false

  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) return false

  const expected = await hashPassword(adminPassword)
  return token === expected
}

export async function getAdminToken(password: string): Promise<string> {
  return hashPassword(password)
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE
}
