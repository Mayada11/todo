import { TmplAstBoundAttribute } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import{TodoService} from 'src/app/todo.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {todo} from 'src/app/models/todo.model'
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  dateCreated:Date;
  constructor(private todoservice:TodoService,private route:ActivatedRoute,private router:Router) { 
  }
lists:any[];
todos:any[];
selectedListId:string;

  ngOnInit(): void {
    this.route.params.subscribe((params:Params)=>{
      if(params.listId){
        this.selectedListId=params.listId;
      console.log(params);
      this.todoservice.getTodos(params.listId).subscribe((todos:any[])=>{
          this.todos=todos;
      
      })
    }else{
      this.todos = undefined;
    }
    }
   
    
    )
    this.todoservice.getLists().subscribe((lists:any[])=>{
      console.log(lists);
      this.lists=lists;
      })

  }
  
  // createNewList(){
  //   this.todoservice.createList('testing').subscribe((respone:any)=>{
  //       console.log(respone);
  //   })
  onTodoClick(todo:todo){
//we want to set todo to completed
      this.todoservice.completed(todo).subscribe(()=>{
        console.log("completed successfully!");
        todo.completed=!todo.completed;
      })
  }
  onDeleteListClick(){
    this.todoservice.deleteList(this.selectedListId).subscribe((res:any)=>{
      this.router.navigate(['/lists']);
      console.log(res);
    })
  }
  
  onTodoDeleteClick(id:string){
    this.todoservice.deleteTodo(this.selectedListId,id).subscribe((res:any)=>{
      this.todos = this.todos.filter(val => val._id !== id);
      console.log(res);
    })
  }
}
