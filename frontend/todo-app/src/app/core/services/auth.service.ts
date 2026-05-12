import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

const USER_STORAGE_KEY = 'todo_app_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/googleauth/login`;
  private currentUserSubject = new BehaviorSubject<GoogleUser | null>(this.loadUserFromStorage());

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): GoogleUser | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  login(idToken: string): Observable<GoogleUser> {
    return this.http.post<GoogleUser>(this.apiUrl, { idToken }).pipe(
      tap(user => {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  private loadUserFromStorage(): GoogleUser | null {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}