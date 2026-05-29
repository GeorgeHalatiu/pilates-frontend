import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private http = inject(HttpClient);
  private apiUrl = `https://${window.location.hostname}:8000/sessions`;
  
  isOnline = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline.next(true);
      this.syncData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline.next(false);
    });
  }

  saveLocally(operation: string, data: any) {
    const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
    queue.push({ operation, data });
    localStorage.setItem('syncQueue', JSON.stringify(queue));
  }

  syncData() {
    const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
    if (queue.length === 0) return;

    queue.forEach((item: any) => {
      if (item.operation === 'ADD') {
        this.http.post(this.apiUrl, item.data).subscribe();
      } else if (item.operation === 'DELETE') {
        this.http.delete(`${this.apiUrl}/${item.data}`).subscribe();
      } else if (item.operation === 'UPDATE') {
        this.http.put(`${this.apiUrl}/${item.data.id}`, item.data).subscribe();
      }
    });

    localStorage.removeItem('syncQueue');
  }
}