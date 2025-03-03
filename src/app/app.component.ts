import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TodoStore } from './store/todos.store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
})

export class AppComponent {
  newTodoTitle = signal('');
  store = inject(TodoStore);

  submitNewTodo() {
    this.store.addTodo(this.newTodoTitle());
    this.newTodoTitle.set(''); 
  }
}
