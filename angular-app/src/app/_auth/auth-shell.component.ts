import { Component, inject, signal } from '@angular/core';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ThemeService } from '../utils/helpers/theme-helper.service';
import { AuthStore } from './services/auth.store';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [SignInComponent, SignUpComponent],
  templateUrl: './auth-shell.component.html',
  styleUrl: './auth-shell.component.scss'
})
export class AuthPage {
  themeService = inject(ThemeService);
  authStore = inject(AuthStore)
  isLogin = signal(true);

  toggleCard() {
    this.isLogin.update(v => !v);
  }
}