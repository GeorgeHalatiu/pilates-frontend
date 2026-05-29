import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private currentIp = window.location.hostname;
  private apiUrl = `https://${this.currentIp}:8000`;
  private timeoutId: any;

  currentUserRole = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  currentUsername = new BehaviorSubject<string | null>(localStorage.getItem('username'));

  constructor() {
    this.setupInactivityListener();
  }

  register(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  verifyMfa(data: { username: string, code: string }) {
    return this.http.post<any>(`${this.apiUrl}/verify-mfa`, data).pipe(
      tap(res => {
        this.currentUserRole.next(res.role);
        this.currentUsername.next(res.username);
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('username', res.username);
        localStorage.setItem('user_id', res.user_id);
        this.resetInactivityTimer();
      })
    );
  }

  forgotPassword(data: { username: string }) {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, data);
  }

  resetPassword(data: { username: string, code: string, new_password: string }) {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, data);
  }

  logout() {
    this.currentUserRole.next(null);
    this.currentUsername.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private setupInactivityListener() {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, () => this.resetInactivityTimer());
    });
  }

  private resetInactivityTimer() {
    if (!localStorage.getItem('token')) return;
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      this.logout();
      window.location.href = '/login';
    }, 15 * 60 * 1000); 
  }
}