import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Session } from '../models/session';
import { SyncService } from './sync.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private http = inject(HttpClient);
  private syncService = inject(SyncService);
  
  private currentIp = window.location.hostname;
  private apiUrl = `https://${this.currentIp}:8000/sessions`;

  private getUserId(): string {
    return localStorage.getItem('user_id') || '';
  }

  getSessions(): Observable<Session[]> {
    if (!this.syncService.isOnline.value) {
      const cached = JSON.parse(localStorage.getItem('sessionCache') || '[]');
      const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
      const offlineAdds = queue.filter((item: any) => item.operation === 'ADD').map((item: any) => item.data);
      return of([...cached, ...offlineAdds]);
    }
    
    const userId = this.getUserId();
    return this.http.get<Session[]>(`${this.apiUrl}?user_id=${userId}`).pipe(
      tap(data => localStorage.setItem('sessionCache', JSON.stringify(data)))
    );
  }

  addSession(session: any): Observable<any> {
    session.user_id = this.getUserId();
    
    if (!this.syncService.isOnline.value) {
      this.syncService.saveLocally('ADD', session);
      return of(session);
    }
    return this.http.post<Session>(this.apiUrl, session);
  }

  updateSession(session: any): Observable<any> {
    session.user_id = this.getUserId();
    
    if (!this.syncService.isOnline.value) {
      this.syncService.saveLocally('UPDATE', session);
      return of(session);
    }
    return this.http.put<Session>(`${this.apiUrl}/${session.id}`, session);
  }

  deleteSession(id: any): Observable<any> {
    if (!this.syncService.isOnline.value) {
      this.syncService.saveLocally('DELETE', id);
      return of(null);
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}