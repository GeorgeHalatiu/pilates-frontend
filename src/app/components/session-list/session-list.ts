import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../services/session';
import { Session } from '../../models/session';
import { CookieService } from '../../services/cookie.service';
import { SyncService } from '../../services/sync.service';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './session-list.html',
  styleUrls: ['./session-list.css'],
})
export class SessionList implements OnInit {
  allSessions: Session[] = [];
  chatMessages: any[] = [];
  chatInput: string = '';
  chatWs!: WebSocket;
  currentUser: string = localStorage.getItem('username') || 'Unknown';       
  paginatedSessions: Session[] = []; 
  
  currentPage: number = 1;
  pageSize: number = 5; 
  totalPages: number = 1;

  showDetailsModal = false;
  showEditModal = false;
  selectedSession: Session | null = null;
  editForm!: FormGroup;

  userPreference: string | null = null;
  isGeneratorRunning = false;
  isClearing = false;

  private http = inject(HttpClient); 
  
  availableTimes = ['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '04:00 PM', '05:30 PM', '07:00 PM'];

  constructor(
    private sessionService: SessionService, 
    private fb: FormBuilder,
    private cookieService: CookieService,
    private cdr: ChangeDetectorRef,
    private syncService: SyncService
  ) {}

  ngOnInit(): void {
    this.refreshList();
    
    this.syncService.isOnline.subscribe(online => {
      if (online) {
        setTimeout(() => this.refreshList(), 500);
      }
    });

    const ws = new WebSocket('wss://pilates-backend-7b1i.onrender.com/ws');
    ws.onmessage = (event) => {
      if (event.data === 'UPDATE_REQUIRED') {
        this.refreshList();
      }
    };

    this.userPreference = this.cookieService.getCookie('preferredSession');
    
    this.editForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      type: ['', Validators.required]
    });

    this.chatWs = new WebSocket('wss://pilates-backend-7b1i.onrender.com/ws/chat');
    this.chatWs.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.chatMessages.push(message);
      this.cdr.detectChanges();
    };
  }

  refreshList() {
    this.sessionService.getSessions().subscribe(data => {
      this.allSessions = data;
      this.totalPages = Math.ceil(this.allSessions.length / this.pageSize) || 1;
      
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = this.totalPages;
      }
      
      this.updatePaginatedSessions();
      this.cdr.detectChanges(); 
    });
  }

  updatePaginatedSessions() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSessions = this.allSessions.slice(startIndex, endIndex); 
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedSessions();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedSessions();
    }
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'Admin';
  }

  viewDetails(session: Session) {
    this.selectedSession = session;
    this.showDetailsModal = true;
  }

  openEdit(session: Session) {
    this.selectedSession = session;
    this.editForm.patchValue({ date: session.date, time: session.time, type: session.type });
    this.showEditModal = true;
  }

  setEditType(type: string) { 
    this.editForm.patchValue({ type: type }); 
  }

  saveChanges() {
    if (this.editForm.valid && this.selectedSession) {
      const updatedSession = {
        ...this.selectedSession,
        date: this.editForm.value.date, 
        time: this.editForm.value.time, 
        type: this.editForm.value.type
      };
      this.sessionService.updateSession(updatedSession).subscribe(() => {
        this.refreshList();
        this.showEditModal = false;
      });
    }
  }

  delete(id: any): void {
    this.sessionService.deleteSession(id).subscribe(() => {
      this.refreshList(); 
    });
  }

  startGenerator() {
    this.isGeneratorRunning = true;
    this.cdr.detectChanges();
    
    const userId = localStorage.getItem('user_id');
    
    this.http.post('https://pilates-backend-7b1i.onrender.com/admin/start?user_id=${userId}', {}).subscribe({
      error: (err) => { console.error(err); this.isGeneratorRunning = false; }
    });
  }

  stopGenerator() {
    this.isGeneratorRunning = false;
    this.cdr.detectChanges();
    
    this.http.post('https://pilates-backend-7b1i.onrender.com/admin/stop', {}).subscribe();
  }

  clearAllSessions() {
    if (confirm("Are you absolutely sure you want to wipe the entire schedule?")) {
      this.isClearing = true;
      this.cdr.detectChanges();
      
      this.http.delete('https://pilates-backend-7b1i.onrender.com/admin/clear').subscribe({
        next: () => {
          setTimeout(() => { 
            this.isClearing = false; 
            this.cdr.detectChanges(); 
          }, 1000); 
        },
        error: (err) => { console.error(err); this.isClearing = false; }
      });
    }
  }

  sendMessage() {
    if (this.chatInput.trim()) {
      const msg = {
        sender: this.currentUser,
        text: this.chatInput
      };
      this.chatWs.send(JSON.stringify(msg));
      this.chatInput = '';
    }
  }
}