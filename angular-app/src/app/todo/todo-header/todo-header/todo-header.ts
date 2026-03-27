import { Component, Input, inject } from '@angular/core';
import { AuthStore } from '../../../_auth/services/auth.store';
import { ThemeService } from '../../../utils/helpers/theme-helper.service'; // Ajusta la ruta

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './todo-header.html',
  styleUrl: './todo-header.scss',
})
export class TodoHeader {
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