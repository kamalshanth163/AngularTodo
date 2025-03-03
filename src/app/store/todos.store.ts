import { getState, patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { TodoItem } from './todos.model';
import { computed, effect } from '@angular/core';

const todoStoreKey = 'ng_todos';

type TodoFilter = 'all' | 'active' | 'completed'

type TodoState = {
  todos: TodoItem[],
  filter: TodoFilter
}

const initialState: TodoState = {
  todos: [],
  filter: 'all'
}

export const TodoStore = signalStore(
  { providedIn: 'root'},
  withState(initialState),

  withComputed(({todos, filter}) => ({
    completedTodos: computed(() =>
      todos().filter(todoItem => {
        return todoItem.completed;
      })
    ),
    filteredTodos: computed(() => {
      switch (filter()) {
        case 'completed':
          return todos().filter((todo) => todo.completed);
        case 'active':
          return todos().filter((todo) => !todo.completed);
        default:
          return todos();
      }
    })
  })),

  withMethods((store) => ({
    // Add todo
    addTodo(newTodoTitle: string) {
      patchState(store, {
        todos: [{
          id: Date.now().toString(),
          title: newTodoTitle,
          completed: false
        }, ...store.todos()]
      })
    },
    // Toggle todo
    toggleTodo(todoId: string) {
      patchState(store, {
        todos: store.todos().map(todo => {
          if(todo.id === todoId){
            return {
              ...todo,
              completed: !todo.completed
            }
          }
          return todo;
        })
      })
    },
    // Change filter
    changeFilter(filter: TodoFilter) {
      patchState(store, {
        filter
      })
    }
  })),

  withHooks({
    onInit(store) {
      var todosFromStorage = JSON.parse(
        localStorage.getItem(todoStoreKey) || "[]"
      );
      patchState(store, {todos: todosFromStorage})

      effect(() => {
        const state = getState(store);
        console.log(state)
        localStorage.setItem(todoStoreKey, JSON.stringify(state.todos))
      })
    }
  })
);
