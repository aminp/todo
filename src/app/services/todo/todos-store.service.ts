import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { uuid } from '../../uuid';
import { Todo } from '../../models/todo.model';
import { TodosService }  from './todos.service';

@Injectable({providedIn: 'root'})
export class TodosStoreService {

  constructor(private todosService: TodosService) {
    this.fetchAll()
  }

  private readonly _todos = new BehaviorSubject<Todo[]>([]);
  readonly todos$ = this._todos.asObservable();
  readonly completedTodos$ = this.todos$.pipe(
    map(todos => todos.filter(todo => todo.completed))
  );

  readonly uncompletedTodos$ = this.todos$.pipe(
    map(todos => todos.filter(todo => !todo.completed))
  );

  get todos(): Todo[] {
    return this._todos.getValue();
  }
  
  set todos(val: Todo[]) {
    this._todos.next(val);
  }

  async addTodo(title: string) {

    if(title && title.length) {
      const tempTodoId = uuid();
      const tmpTodo = {id: tempTodoId, title, completed: false};

      this.todos = [
        ...this.todos, 
        tmpTodo
      ];

      try {
        const todo = await this.todosService
          .create({title, completed: false})
          .toPromise();

        const index = this.todos.indexOf(this.todos.find(t => t.id === tempTodoId));
        this.todos[index] = {
          ...todo
        }
        this.todos = [...this.todos];
      } catch (e) {
        console.error(e);
        this.removeTodo(tempTodoId, false);
      }
      
    }

  }

  async removeTodo(id: string, serverRemove = true) {
    const todo = this.todos.find(t => t.id === id);
    this.todos = this.todos.filter(todo => todo.id !== id);

    if(serverRemove) {
      try {
        await this.todosService.remove(id).toPromise();
      } catch (e) {
        console.error(e);
        this.todos = [...this.todos, todo];
      }

    }

  }

  async setCompleted(id: string, completed: boolean) {
    let todo = this.todos.find(todo => todo.id === id);

    if(todo) {
      const index = this.todos.indexOf(todo);

      this.todos[index] = {
        ...todo,
        completed
      }

      this.todos = [...this.todos];

      try {
        await this.todosService
          .setCompleted(id, completed)
          .toPromise();
      } catch (e) {
        console.error('todo status update error:', e);
        this.todos[index] = {
          ...todo,
          completed: !completed
        }
      }
    }
  }
  async fetchAll() {
    this.todos = await this.todosService.getTodos().toPromise();
  }

}