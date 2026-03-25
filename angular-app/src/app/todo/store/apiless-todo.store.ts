import { computed, effect } from '@angular/core';
import {
  patchState,
  signalStore,
  withState,
  withComputed,
  withMethods
} from '@ngrx/signals';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}
export interface Stats {
  total: number;
  completed: number;
  active: number;
}

type Filters = 'all' | 'active' | 'completed';
const STORAGE_KEY = 'todos_v1';
interface TodoState {
  todos: Todo[];
  filter: Filters;
}

const initialState: TodoState = {
  todos: loadInitialTodos(),
  filter: 'all'
};

function loadInitialTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Todo[]) : [];
  } catch {
    return [];
  }
}

export const TodoStore = signalStore(
  withState(initialState),

  withComputed((state) => ({
    filteredTodos: computed(() => {
      const filter = state.filter();
      const items = state.todos();

      if (filter === 'active') return items.filter((t) => !t.completed);
      if (filter === 'completed') return items.filter((t) => t.completed);

      return items;
    }),

    stats: computed<Stats>(() => {
      const items = state.todos();
      const completed = items.filter((t) => t.completed).length;

      return {
        total: items.length,
        completed,
        active: items.length - completed,
      };
    })
  })),

  withMethods((state) => ({
    add: (title: string) => {
      const t = title.trim();
      if (!t) return;

      const todo: Todo = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: new Date(),
      };

      patchState(state, {
        todos: [...state.todos(), todo],
      });
    },

    toggle: (id: string) => {
      patchState(state, {
        todos: state
          .todos()
          .map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
      });
    },

    rename: (id: string, title: string) => {
      patchState(state, {
        todos: state
          .todos()
          .map((t) =>
            t.id === id ? { ...t, title } : t
          ),
      });
    },

    remove: (id: string) => {
      patchState(state, {
        todos: state.todos().filter((t) => t.id !== id),
      });
    },

    setFilter: (filter: Filters) => {
      patchState(state, { filter });
    }
  })),

  withMethods((state) => {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos()));
    });
    return {};
  })
);