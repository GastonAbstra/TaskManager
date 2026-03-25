import { Component, inject } from '@angular/core';
import { TodoStore } from '../../store/todo.store';

type Filters = 'all'|'active'|'completed';

@Component({
  selector: 'app-todo-filter',
  imports: [],
  templateUrl: './todo-filter.html',
  styleUrl: './todo-filter.scss',
})

export class TodoFilter {
  private readonly store = inject(TodoStore);
  readonly currentFilter = this.store.filter;
  readonly filter = (filter: Filters) => this.store.setFilter(filter);
}
