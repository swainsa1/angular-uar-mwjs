import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { TodoService } from '../shared/services/todo.service';
import { Todo } from '../shared/classes/todo';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  addForm: FormGroup;
  formErrors = {
    item: ''
};
validationMessages = {
  item: {
      required: 'Item is required.',
      minlength: 'Item must be at least 3 characters'
  }
};

errorMessage: string;
todoList: Todo[] = [];

constructor(private formBuilder: FormBuilder, private todoService: TodoService) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      item: ['', [Validators.required, Validators.minLength(3)]]
    });
    
    this.addForm.statusChanges.subscribe(data => this.onStatusChanged(data));
    this.onStatusChanged();
    this.getTodoListAll();
  }
  save(): void {

    this.todoService.save(this.addForm.value.item)
 .subscribe(result => {
     console.log('save result', result);
     this.todoList.push(result);
 } ,
 (error: HttpErrorResponse) => {
     this.errorMessage = `${error.status} ${error.statusText}. ${error.message}`;
 }


);

    console.log('form values: ', this.addForm.value);
  }


  completeTodo(todo: Todo): void {
    todo.completed = !todo.completed;
    this.todoService.updateTodo(todo)
        .subscribe(
            (data: string) => {
                // do nothing
               console.log('updated todo', data, todo);
            },
            (error: HttpErrorResponse) => {
                todo.completed = !todo.completed;
                this.errorMessage = `${error.status} ${error.statusText}. ${error.message}`;
            }
        );
}

deleteTodo(todo: Todo): void {
  this.todoService.deleteTodo(todo)
  .subscribe(
      (data: string) => {
          console.log('deleteTodo response', data, todo);
          const index = this.todoList.indexOf(todo);
          this.todoList.splice(index, 1);
      },
      (error: HttpErrorResponse) => {
          todo.completed = !todo.completed;
          this.errorMessage = `${error.status} ${error.statusText}. ${error.message}`;
      }
  );
}

  onStatusChanged(data?: any) {
    if (!this.addForm) { return; }
    const form = this.addForm;

    for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                 for (const key in messages) {
                    if (messages.hasOwnProperty(key) && control.hasError(key)) {
                        this.formErrors[field] += `${messages[key]} `;
                    }
                }
            }
        }
    }
}


getTodoListAll(): void {
  this.todoService.getAll()
  .subscribe(
      (data: Todo[]) => {
          this.todoList = data;
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = `${error.status} ${error.statusText}. ${error.message}`;
      }
  );
}

}
