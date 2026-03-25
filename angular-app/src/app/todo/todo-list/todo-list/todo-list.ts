import { Component, inject } from '@angular/core';
import { TodoStore } from '../../store/todo.store';
import { TodoStats } from '../../todo-stats/todo-stats/todo-stats';
import { TodoFilter } from '../../todo-filter/todo-filter/todo-filter';
import { UpdateTodoApiRequestModel } from '../../data-access/update-todo-api-request.model';
import { AuthStore } from '../../../_auth/services/auth.store';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoStats, TodoFilter],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList {
  readonly store = inject(TodoStore);
  authStore = inject(AuthStore);

  readonly list = this.store.filteredTodos;
  readonly stats = this.store.stats;

  toggle(todoId: string, title: string, currentStatus: boolean) {
    const userId = this.authStore.currentUser()?.id ?? -1;
    const request = new UpdateTodoApiRequestModel(
      todoId,
      userId,
      title,
      !currentStatus
    );
    this.store.update(request);
  }

  rename(todoId: string, newTitle: string, currentStatus: boolean) {
    const userId = this.authStore.currentUser()?.id ?? -1;
    const request = new UpdateTodoApiRequestModel(todoId, userId, newTitle, currentStatus);
    this.store.update(request);
  }
}