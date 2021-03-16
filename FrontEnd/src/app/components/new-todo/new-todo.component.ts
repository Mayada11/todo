import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { todo } from 'src/app/models/todo.model';
import { TodoService } from 'src/app/todo.service';
@Component({
  selector: 'app-new-todo',
  templateUrl: './new-todo.component.html',
  styleUrls: ['./new-todo.component.css']
})
export class NewTodoComponent implements OnInit {

  constructor(private todoservice:TodoService ,private route:ActivatedRoute,private router:Router) { }
listId:string;
  ngOnInit(): void {
    this.route.params.subscribe((params:Params)=>{
      this.listId=params['listId'];
      // console.log(this.listId);
    })
  }
  createTodo(title:string){
    this.todoservice.createTodo(title,this.listId).subscribe((newTodo:todo)=>{
      // console.log(newTodo);
      // this.route.navigate(['/lists',list._id]);
      this.router.navigate(['../'],{relativeTo:this.route});
    })
}
}