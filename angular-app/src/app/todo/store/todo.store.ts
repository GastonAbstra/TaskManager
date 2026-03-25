import { computed, effect, inject } from "@angular/core";
import { exhaustMap, pipe, tap } from "rxjs";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { addEntities, addEntity, removeEntity, setAllEntities, updateEntity, withEntities } from "@ngrx/signals/entities";
import { rxMethod } from "@ngrx/signals/rxjs-interop";

import { ApiResult } from "../../utils/helpers/api-result.model";

import { CreateTodoApiRequestModel } from "../data-access/create-todo-api-request.model";
import { TodoService } from "../data-access/todo-api.service";
import { TodoApiResponseModel } from "../data-access/todo-api-response.model";
import { UpdateTodoApiRequestModel } from "../data-access/update-todo-api-request.model";

import { Todo } from "./todo.model";
import { GetTodoApiRequestModel } from "../data-access/get-todo-api-request.model";
import { AuthStore } from "../../_auth/services/auth.store";

export interface Stats {
  total: number;
  completed: number;
  active: number;
}

type Filters = 'all'|'active'|'completed'

interface TodoState {
  filter: Filters
}

const initialState: TodoState = {
  filter: 'all'
}

export const TodoStore = signalStore(
  withState(initialState),
  withEntities<Todo>(),
  withComputed((state) => ({
    filteredTodos: computed(() => {
      const items = state.entities();
      const filter = state.filter();

      if (filter === 'completed') {
        return items.filter((todo) => todo.completed);
      }
      if (filter === 'active') {
        return items.filter((todo) => !todo.completed);
      }
      console.log("filteredTodos: ",items)
      return items;
    }),

    stats: computed<Stats>(() => {
      const total = state.entities().length;
      const active = state.entities().filter((todo) => todo.completed).length;
      const completed = state.entities().filter((todo) => todo.completed).length;

      return{
        total: total,
        active: active,
        completed: completed
      };
    })
  })),
  withMethods((state, todoApiService = inject(TodoService)) => ({
    
    create: rxMethod<CreateTodoApiRequestModel>(
      pipe(
        exhaustMap((request) => {
          return todoApiService.create(request).pipe(
            tap((result: ApiResult<TodoApiResponseModel>) => {
              if (result.success && result.data) {
                const newTodo = new Todo(
                  result.data.id,
                  result.data.title,
                  result.data.completed
                );
                patchState(state, addEntity(newTodo));
              }
            })
          );
        })
      )
    ),

    get: rxMethod<GetTodoApiRequestModel>(
      pipe(
        exhaustMap((request) => {
          return todoApiService.get(request).pipe(
            tap((result: ApiResult<TodoApiResponseModel[]>) => {
              if (result.success && result.data) {
                const todos = result.data.map((todo)=>
                  new Todo(
                    todo.id,
                    todo.title,
                    todo.completed
                  )
                );
                console.log(todos);
                patchState(state, setAllEntities(todos));
              }
            })
          )
        })
      )
    ),

    update: rxMethod<UpdateTodoApiRequestModel>(
      pipe(
        exhaustMap((request) => {
          return todoApiService.update(request).pipe(
            tap((result: ApiResult<TodoApiResponseModel>) => {
              if(result.success && result.data) {
                const updatedTodo = new Todo(
                  result.data.id,
                  result.data.title,
                  result.data.completed
                );
                patchState(state, updateEntity({id: result.data.id, changes: updatedTodo}))
              }
            })
          )
        })
      )
    ),

    delete: rxMethod<string>(
      pipe(
        exhaustMap((id) => {
          return todoApiService.delete(id).pipe(
            tap((response: ApiResult<TodoApiResponseModel>) => {
              if (response.success) {
                patchState(state, removeEntity(id));
              }
            })
          )
        })
      )
    ),

    setFilter: (filter: Filters) => {
      patchState(state, { filter })
    }

  })),
  withHooks({
    onInit(state, authStore = inject(AuthStore)) {
      effect(() => {
        const user = authStore.currentUser();
        if (user && user.id){
          const getTodo = new GetTodoApiRequestModel(
            user.id
          );
          state.get(getTodo);
        }
      })
    }
  })
  
);