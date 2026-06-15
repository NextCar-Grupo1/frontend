import { Injectable, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { ApiRepositoryService } from '../../shared/infrastructure/http/api-repository.service';
import { UserProfile } from '../domain/model/user-profile.model';
import { UserResource } from '../domain/model/sign-up-request.model';
import { storeToken, clearStoredToken } from '../../shared/infrastructure/http/auth.interceptor';

const SESSION_KEY = 'nextcar.session';
const SESSION_USER_KEY = 'nextcar.session.user';

export interface SessionUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly currentUser = signal<SessionUser | null>(this.restoreSession());

  constructor(private readonly api: ApiRepositoryService) {}

  get isAuthenticated(): boolean {
    return Boolean(this.currentUser());
  }

  /** Login against real Spring Boot backend — returns JWT token */
  login(email: string, password: string): Observable<SessionUser | null> {
    return this.api.signIn({ email, password }).pipe(
      map((authUser) => {
        if (!authUser) return null;
        return {
          id: authUser.id,
          email: authUser.email,
          firstName: '',
          lastName: '',
          token: authUser.token,
          roles: [...authUser.roles],
        } as SessionUser;
      }),
      tap((sessionUser) => {
        if (sessionUser) {
          this.setUser(sessionUser);
        }
      }),
    );
  }

  /** Register against real Spring Boot backend */
  register(request: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    documentNumber?: string;
  }): Observable<boolean> {
    return this.api.signUp(request).pipe(map(() => true));
  }

  /** Fetch full user profile from backend after registration/login */
  fetchUserProfile(): Observable<SessionUser | null> {
    const current = this.currentUser();
    if (!current) {
      return of(null);
    }
    return this.api.getUser(current.id).pipe(
      map((userResource: UserResource) => {
        if (!userResource) return null;
        const sessionUser: SessionUser = {
          id: userResource.id,
          email: userResource.email,
          firstName: userResource.firstName,
          lastName: userResource.lastName,
          token: current.token,
          roles: userResource.roles,
        };
        return sessionUser;
      }),
      tap((sessionUser) => {
        if (sessionUser) this.setUser(sessionUser);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_USER_KEY);
    clearStoredToken();
    this.currentUser.set(null);
  }

  private setUser(user: SessionUser): void {
    storeToken(user.token);
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      }),
    );
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private restoreSession(): SessionUser | null {
    const stored = localStorage.getItem(SESSION_USER_KEY);
    return stored ? (JSON.parse(stored) as SessionUser) : null;
  }
}
