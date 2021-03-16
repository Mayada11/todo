import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TodoService } from 'src/app/todo.service';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.css']
})
export class EditTodoComponent implements OnInit {

  constructor(private route: ActivatedRoute, private todoService: TodoService, private router: Router) { }

  todoId: string;
  listId: string;

  
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.todoId = params.todoId;
        this.listId = params.listId;
      }
    )
  }

  updateTodo(title: string) {
    this.todoService.updateTodo(this.listId, this.todoId, title).subscribe(() => {
      this.router.navigate(['/lists', this.listId]);
    })
  }
}
