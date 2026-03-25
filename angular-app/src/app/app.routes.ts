import { Routes } from '@angular/router';
import { authRoutes } from './_auth/auth.routes';
import { authGuard } from './_auth/guards/auth.guard';
import { TodoComponent } from './todo/todo.component';
export const routes: Routes = [
  ...authRoutes,
  
  { 
    path: '', 
    component: TodoComponent, 
    canActivate: [authGuard]      
  },

  { path: '**', redirectTo: '' }
];