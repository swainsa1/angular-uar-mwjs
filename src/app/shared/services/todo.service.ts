import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../classes/todo';
import { Observable } from 'rxjs';
const requestOptions = { withCredentials: true };
@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient) { }


  save(item: string): Observable<Todo> {
    return this.http.post<Todo>('https://sails-ws.herokuapp.com/todo', new Todo(item), requestOptions);
}

getAll(): Observable<Todo[]> {
  return this.http.get<Todo[]>('https://sails-ws.herokuapp.com/todo', requestOptions);
}

updateTodo(todo: Todo): Observable<string> {
  const url = `https://sails-ws.herokuapp.com/todo/${todo.id}`;

  return this.http.patch(url, todo, {
  withCredentials: true,
  responseType: 'text',
  });
}


deleteTodo(todo: Todo): Observable<string> {
  const url = `https://sails-ws.herokuapp.com/todo/${todo.id}`;
 
  return this.http.delete(url, {
          withCredentials: true,
          responseType: 'text',
      });
  }

}
