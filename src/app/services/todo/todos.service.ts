import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../../models/todo.model';

@Injectable({providedIn: 'root'})
export class TodosService {
  private readonly apiRoute = '/api/todos/';
  private readonly apiBaseUrl = 'https://5f0998d0445d080016692192.mockapi.io/';
  constructor(private http: HttpClient) { }

  getTodos() {
    let _tds:any = this.http.get<Todo[]>(this.apiBaseUrl)
    console.log(_tds);
    return this.http.get<Todo[]>(this.apiBaseUrl);
  }

  create(todo: Todo) {
    return this.http.post<Todo>(`${this.apiBaseUrl}${this.apiRoute}`, todo);
  }

  remove(id) {
    return this.http.delete(`${this.apiBaseUrl}${this.apiRoute}${id}`);
  }

  setCompleted(id: string, completed: boolean) {
    return this.http.put<Todo>(`${this.apiBaseUrl}${this.apiRoute}${id}`, {completed});
  }

}