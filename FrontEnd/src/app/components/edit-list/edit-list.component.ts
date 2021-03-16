import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TodoService } from 'src/app/todo.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css']
})
export class EditListComponent implements OnInit {

  constructor(private route:ActivatedRoute,private todoService:TodoService,private router:Router) { }
  listId:string
  ngOnInit(): void {
    this.route.params.subscribe((params:Params)=>{
    //   if(params.listId){
    //   //   this.selectedListId=params.listId;
    //   // console.log(params);
    //   // this.todoservice.getTodos(params.listId).subscribe((todos:any[])=>{
    //   //     this.todos=todos;
      
    //   // })

    // }else{
    //   this.todos = undefined;
    // }
    this.listId = params.listId;
    })
  }


  updateList(title:string){
this.todoService.updateList(this.listId,title).subscribe(()=>{
this.router.navigate(['/lists',this.listId]);
})
  }
}
