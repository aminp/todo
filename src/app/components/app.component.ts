import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import {TodosStoreService} from '../services/todo/todos-store.service';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'todo-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent  {

  @ViewChild('todoTitleInput') todoTitleInput: ElementRef;

  todosTrackFn = (i: Number, todo: Todo) => todo.id;

  constructor(public todosStore: TodosStoreService) {}

  onAddTodo(title: string){
    this.todosStore.addTodo(title); 
    this.todoTitleInput.nativeElement.value = '';
  }
}
