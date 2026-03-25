import { Routes } from '@angular/router';
import { AuthPage } from './auth-shell.component';

export const authRoutes: Routes = [
  {
    path: 'auth',
    children: [
      { path: '', component: AuthPage },
      { path: 'signin', redirectTo: '' },
      { path: 'signup', redirectTo: '' },
    ]
  },
];
