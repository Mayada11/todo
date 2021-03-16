import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { list } from 'src/app/models/list.model';
import { TodoService } from 'src/app/todo.service';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.css']
})
export class NewListComponent implements OnInit {
// lists:any;
  constructor(private todoservice:TodoService,private router:Router) { }

  ngOnInit(): void {
  }
createList(title:string){
  this.todoservice.createList(title).subscribe((list:list)=>{
         console.log(list);
         //now we navigate to list/response._id
         this.router.navigate(['/lists',list._id]);

});

}

}