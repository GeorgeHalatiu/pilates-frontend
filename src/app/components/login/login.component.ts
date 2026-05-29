import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="logo-container">
          <img src="/logo1.png" alt="Pilates The Studio" class="logo">
        </div>

        <p class="quote" *ngIf="mode === 'login'">The greatest wealth is health</p>
        
        <div class="header-text">
          <h3 *ngIf="mode === 'login'">Welcome Back</h3>
          <h3 *ngIf="mode === 'register'">Create Your Account</h3>
          <h3 *ngIf="mode === 'forgot'">Recover Password</h3>
          <h3 *ngIf="mode === 'reset'">Set New Password</h3>
          <h3 *ngIf="mode === 'mfa'">Two-Factor Authentication</h3>
          
          <p class="subtitle" *ngIf="mode === 'login'">Enter your credentials to access your sanctuary</p>
          <p class="subtitle" *ngIf="mode === 'register'">Join our sanctuary and begin your wellness journey</p>
          <p class="subtitle" *ngIf="mode === 'forgot'">Enter your username to receive a recovery code</p>
          <p class="subtitle" *ngIf="mode === 'reset'">Enter the 6-digit code we sent you and your new password</p>
          <p class="subtitle" *ngIf="mode === 'mfa'">Enter the 6-digit login code from your authenticator</p>
        </div>

        <form [formGroup]="authForm" (ngSubmit)="onSubmit()">
          
          <div class="input-group" *ngIf="mode === 'register'">
            <label>Full Name</label>
            <input type="text" placeholder="Jane Doe" formControlName="fullName">
          </div>

          <div class="input-group" *ngIf="mode !== 'mfa'">
            <label>Username</label>
            <input type="text" placeholder="Enter your username" formControlName="username">
          </div>

          <div class="input-group" *ngIf="mode === 'reset' || mode === 'mfa'">
            <label>{{ mode === 'mfa' ? 'Login Code' : 'Recovery Code' }}</label>
            <input type="text" placeholder="123456" formControlName="code">
          </div>

          <div class="input-group" *ngIf="mode === 'login' || mode === 'register' || mode === 'reset'">
            <label>{{ mode === 'reset' ? 'New Password' : 'Password' }}</label>
            <input type="password" placeholder="••••••••" formControlName="password">
          </div>

          <button type="submit" [disabled]="!isFormValid()">
            <span *ngIf="mode === 'login'">Sign In</span>
            <span *ngIf="mode === 'register'">Create Account</span>
            <span *ngIf="mode === 'forgot'">Send Recovery Code</span>
            <span *ngIf="mode === 'reset'">Reset Password</span>
            <span *ngIf="mode === 'mfa'">Verify & Log In</span>
          </button>
          
          <p *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</p>
        </form>

        <div class="toggle-mode">
          <a href="javascript:void(0)" *ngIf="mode === 'login'" (click)="setMode('forgot')" style="display: block; margin-bottom: 10px;">
            Forgot your password?
          </a>
          <a href="javascript:void(0)" *ngIf="mode === 'login'" (click)="setMode('register')">
            Don't have an account? Create one here
          </a>
          <a href="javascript:void(0)" *ngIf="mode !== 'login'" (click)="setMode('login')">
            Back to Sign In
          </a>
        </div>
        
        <p class="disclaimer" *ngIf="mode === 'login'">
          Welcome to sanctuary — a serene space where mind and body unite. Book your Pilates sessions with ease and embark on a rewarding journey to balance and strength.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      display: flex; align-items: center; justify-content: center;
      background-image: url('/backround.png'); background-size: cover;          
      background-position: center; background-repeat: no-repeat;
      z-index: 9999; margin: 0; padding: 0; box-sizing: border-box;
      font-family: 'Helvetica Neue', Arial, sans-serif;
    }
    .auth-card {
      background: rgba(255, 255, 255, 0.98); padding: 50px 40px; border-radius: 20px;
      width: 100%; max-width: 420px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); box-sizing: border-box;
    }
    .logo-container { text-align: center; margin-bottom: 15px; }
    .logo { max-width: 220px; }
    .quote { text-align: center; font-style: italic; color: #666; margin-bottom: 30px; font-family: 'Georgia', serif; }
    .header-text h3 { margin: 0 0 8px 0; color: #333; font-size: 1.2rem; font-weight: 600; }
    .header-text .subtitle { margin: 0 0 25px 0; color: #777; font-size: 0.9rem; }
    .input-group { margin-bottom: 18px; }
    .input-group label { display: block; margin-bottom: 6px; color: #333; font-size: 0.85rem; font-weight: 500; }
    .input-group input { width: 100%; padding: 14px 15px; border: 1px solid #eaeaea; background-color: #fafafa; border-radius: 8px; box-sizing: border-box; font-size: 0.95rem; outline: none; transition: border 0.3s; }
    .input-group input:focus { border-color: #8b9b7e; }
    button { width: 100%; padding: 15px; background-color: #8b9b7e; color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; margin-top: 10px; transition: background-color 0.3s; }
    button:hover { background-color: #76856b; }
    button:disabled { background-color: #c9d1c3; cursor: not-allowed; }
    .toggle-mode { text-align: center; margin-top: 25px; }
    .toggle-mode a { color: #8b9b7e; text-decoration: none; font-size: 0.85rem; }
    .toggle-mode a:hover { text-decoration: underline; }
    .error-msg { color: #d9534f; text-align: center; font-size: 0.85rem; margin-top: 15px; }
    .disclaimer { text-align: center; font-size: 0.75rem; color: #999; margin-top: 35px; line-height: 1.5; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  mode: 'login' | 'register' | 'forgot' | 'reset' | 'mfa' = 'login';
  errorMessage = '';

  authForm = this.fb.group({
    fullName: [''], 
    username: ['', Validators.required],
    code: [''],
    password: ['']
  });

  setMode(newMode: 'login' | 'register' | 'forgot' | 'reset' | 'mfa') {
    this.mode = newMode;
    this.errorMessage = '';
    this.authForm.reset();
  }

  isFormValid(): boolean {
    const vals = this.authForm.value;
    if (this.mode === 'forgot') return !!vals.username;
    if (this.mode === 'mfa') return !!vals.code;
    if (this.mode === 'reset') return !!vals.username && !!vals.code && !!vals.password;
    return !!vals.username && !!vals.password;
  }

  onSubmit() {
    if (!this.isFormValid()) return;
    const formVals = this.authForm.value;

    if (this.mode === 'login') {
      this.authService.login(formVals).subscribe({
        next: (res) => {
          if (res.mfa_required) {
            alert(`MFA REQUIRED!\n\nYour 6-digit login code is: ${res.mock_code}`);
            const currentUsername = formVals.username;
            this.setMode('mfa');
            this.authForm.patchValue({ username: currentUsername });
          }
        },
        error: () => this.errorMessage = 'Invalid username or password'
      });
    } else if (this.mode === 'mfa') {
      this.authService.verifyMfa({ username: formVals.username!, code: formVals.code! }).subscribe({
        next: () => this.router.navigate(['/presentation']),
        error: () => this.errorMessage = 'Invalid login code'
      });
    } else if (this.mode === 'register') {
      this.authService.register(formVals).subscribe({
        next: () => {
          this.setMode('login');
          alert('Account created! Please sign in.');
        },
        error: () => this.errorMessage = 'Username already exists'
      });
    } else if (this.mode === 'forgot') {
      this.authService.forgotPassword({ username: formVals.username! }).subscribe({
        next: (res) => {
          alert(`RECOVERY CODE GENERATED!\n\nYour 6-digit recovery code is: ${res.mock_code}`);
          const currentUsername = formVals.username;
          this.setMode('reset');
          this.authForm.patchValue({ username: currentUsername });
        },
        error: () => this.errorMessage = 'User not found'
      });
    } else if (this.mode === 'reset') {
      this.authService.resetPassword({ 
        username: formVals.username!, 
        code: formVals.code!, 
        new_password: formVals.password! 
      }).subscribe({
        next: () => {
          this.setMode('login');
          alert('Password successfully reset! You can now log in.');
        },
        error: () => this.errorMessage = 'Invalid code or username'
      });
    }
  }
}