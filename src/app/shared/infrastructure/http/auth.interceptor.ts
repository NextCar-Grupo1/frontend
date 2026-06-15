import { HttpInterceptorFn } from '@angular/common/http';

const TOKEN_KEY = 'nextcar.auth.token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getStoredToken();

  if (token && !req.url.includes('/authentication/')) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }

  return next(req);
};
