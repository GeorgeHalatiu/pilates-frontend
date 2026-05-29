import { Routes } from '@angular/router';
import { Presentation } from './components/presentation/presentation';
import { SessionList } from './components/session-list/session-list';
import { SessionForm } from './components/session-form/session-form';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
  { path: 'presentation', component: Presentation, canActivate: [authGuard] },
  { path: 'sessions', component: SessionList, canActivate: [authGuard] },
  { path: 'schedule', component: SessionForm, canActivate: [authGuard] },
  { path: 'schedule/:id', component: SessionForm, canActivate: [authGuard] }, 

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];