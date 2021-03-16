import { Injectable } from '@angular/core';
import { todo } from './models/todo.model';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private webReqService:WebRequestService) { }
  createList(title:string){
    //we want to send web request to create a list
   return this.webReqService.post('lists',{title});
  }
  updateList(id:string,title:string){
    //we want to send web request to update a list
   return this.webReqService.patch(`lists/${id}`,{title});
  }
  createTodo(title:string,listId:string){
    //we want to send web request to create a todo
   return this.webReqService.post(`lists/${listId}/todos`,{title});
  }
  getLists(){
    return this.webReqService.get('lists');
  }
  getTodos(listId:string){
      return this.webReqService.get(`lists/${listId}/todos`)
  }
  completed(todo:todo){
    return this.webReqService.patch(`lists/${todo._listId}/todos/${todo._id}`,{
      completed:!todo.completed
    });
  }
  deleteTodo(listId:string,todoId:string){
    return this.webReqService.delete(`lists/${listId}/todos/${todoId}`);
  }
 
    deleteList(id:string){
      return this.webReqService.delete(`lists/${id}`);
    }
    updateTodo(listId: string, todoId: string, title: string) {
      // We want to send a web request to update a list
      return this.webReqService.patch(`lists/${listId}/todos/${todoId}`, { title });
    }

}
