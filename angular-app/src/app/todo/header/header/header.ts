import { Component, Input, inject } from '@angular/core';
import { AuthStore } from '../../../_auth/services/auth.store';
import { ThemeService } from '../../../utils/helpers/theme-helper.service'; // Ajusta la ruta

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() title: string = 'Welcome Back';
  
  private readonly authStore = inject(AuthStore);
  readonly themeService = inject(ThemeService); // Inyectamos el servicio

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

  onLogout() {
    this.authStore.logout();
  }
}