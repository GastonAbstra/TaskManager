import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from './header/header/header';
import { TodoAdd } from './todo-add/todo-add/todo-add';
import { TodoList } from './todo-list/todo-list/todo-list';
import { TodoStore } from './store/todo.store';
import { ThemeService } from '../utils/helpers/theme-helper.service';

@Component({
  selector: 'app-todo.component',
  templateUrl: './todo.component.html',
  providers: [TodoStore],
  imports: [FormsModule, Header, TodoAdd, TodoList],
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  protected themeService = inject(ThemeService);
  protected title = 'we-love-todos';
}
