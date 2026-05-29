import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  title = 'pilates-thestudio';
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  showNavbar = true;

  isChatOpen: boolean = false;
  chatMessages: any[] = [];
  chatInput: string = '';
  chatWs!: WebSocket;

  get currentUser(): string {
    return localStorage.getItem('username') || 'Unknown';
  }

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showNavbar = !(event.url === '/login' || event.url === '/');
      
      if (this.showNavbar) {
        this.connectChat();
      }
    });
  }

  ngOnInit(): void {}

  connectChat() {
    if (this.chatWs && (this.chatWs.readyState === WebSocket.OPEN || this.chatWs.readyState === WebSocket.CONNECTING)) {
      return; 
    }

    this.chatWs = new WebSocket('wss://pilates-backend-7b1i.onrender.com/ws/chat');

    this.chatWs.onopen = () => {
      console.log('Chat WebSocket is OPEN');
    };

    this.chatWs.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.chatMessages.push(message);
      this.cdr.detectChanges();
    };

    this.chatWs.onclose = () => {
      console.log('Chat WebSocket CLOSED');
    };
  }

  logout() {
    if (this.chatWs) {
      this.chatWs.close();
    }
    this.chatMessages = [];
    this.isChatOpen = false;
    this.router.navigate(['/login']);
  }

  sendMessage() {
    if (!this.chatInput.trim()) return;

    if (this.chatWs && this.chatWs.readyState === WebSocket.OPEN) {
      const msg = {
        sender: this.currentUser,
        text: this.chatInput
      };
      this.chatWs.send(JSON.stringify(msg));
      this.chatInput = '';
    } else {
      console.error('Chat is disconnected. Trying to reconnect...');
      this.connectChat();
      setTimeout(() => {
        if (this.chatWs.readyState === WebSocket.OPEN) {
          this.sendMessage();
        } else {
          alert('Cannot connect to chat server. Please ensure Python is running.');
        }
      }, 1000);
    }
  }
}