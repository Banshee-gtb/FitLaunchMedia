const ADMIN_SESSION_KEY = "fl_admin_session";
const ADMIN_PASSCODE = "198440";

export function verifyPasscode(input: string): boolean {
  return input === ADMIN_PASSCODE;
}

export function setAdminSession(): void {
  const session = {
    authenticated: true,
    timestamp: Date.now(),
    expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
  };
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function getAdminSession(): boolean {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    if (!session.authenticated) return false;
    if (Date.now() > session.expiresAt) {
      clearAdminSession();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
