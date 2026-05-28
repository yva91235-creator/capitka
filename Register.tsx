/**
 * Cookie-based device identification & session persistence
 * CapitalFlow — Enterprise Cookie & Device Fingerprint System
 */

const COOKIE_NAME = 'capitalflow_device';
const COOKIE_EXPIRY_DAYS = 30;

export const deviceFingerprint = (): string => {
  const nav = window.navigator;
  const screen = window.screen;
  const fp = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    !!nav.hardwareConcurrency,
  ].join('|||');
  return btoa(encodeURIComponent(fp)).substring(0, 48);
};

export const setDeviceCookie = (token: string): void => {
  const fp = deviceFingerprint();
  const value = `${token}::${fp}`;
  const d = new Date();
  d.setTime(d.getTime() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  document.cookie = `${COOKIE_NAME}=${value}; expires=${d.toUTCString()}; path=/; SameSite=Strict; Secure`;
};

export const getDeviceCookie = (): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
  return match ? match[2] : null;
};

export const clearDeviceCookie = (): void => {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const validateDevice = (): string | null => {
  const cookie = getDeviceCookie();
  if (!cookie) return null;
  const parts = cookie.split('::');
  if (parts.length !== 2) return null;
  const [token, fp] = parts;
  if (fp !== deviceFingerprint()) return null;
  return token;
};

export const storeAuthToken = (token: string): void => {
  try {
    localStorage.setItem('capitalflow_session', token);
    setDeviceCookie(token);
  } catch (e) {
    console.warn('Could not store auth token:', e);
  }
};

export const getStoredToken = (): string | null => {
  try {
    const local = localStorage.getItem('capitalflow_session');
    if (local) return local;
    return validateDevice();
  } catch {
    return null;
  }
};

export const clearAllTokens = (): void => {
  try {
    localStorage.removeItem('capitalflow_session');
    localStorage.removeItem('capitalflow-auth');
    clearDeviceCookie();
  } catch (e) {
    console.warn('Could not clear tokens:', e);
  }
};
