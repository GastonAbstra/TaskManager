import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoStore } from '../../store/todo.store';
import { CreateTodoApiRequestModel } from '../../data-access/create-todo-api-request.model';
import { AuthStore } from '../../../_auth/services/auth.store';

@Component({
  selector: 'app-todo-add',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-add.html',
  styleUrl: './todo-add.scss',
})
export class TodoAdd {
  private readonly store = inject(TodoStore);
  authStore = inject(AuthStore);
  newTitle = signal('');

  onEnter() {
    this.add();
  }

  add() {
    const title = this.newTitle().trim();
    const userId = this.authStore.currentUser()?.id;

    if (title) {
      const request = new CreateTodoApiRequestModel(userId ?? -1,title);
      this.store.create(request);
      this.newTitle.set('');
    }
  }
}