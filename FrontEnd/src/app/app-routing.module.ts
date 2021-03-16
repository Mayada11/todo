import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditListComponent } from './components/edit-list/edit-list.component';
import { EditTodoComponent } from './components/edit-todo/edit-todo.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { NewListComponent } from './components/new-list/new-list.component';
import { NewTodoComponent } from './components/new-todo/new-todo.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';


const routes: Routes = [
  {path:'lists',component:TodoListComponent},
  {path:'',redirectTo:'/login',pathMatch:'full'},
  {path:'new-List',component:NewListComponent},
  {path:'edit-list/:listId',component:EditListComponent},
  {path:'lists/:listId/new-todo',component:NewTodoComponent},
  {path:'lists/:listId/edit-todo/:todoId',component:EditTodoComponent},
  {path:'lists',component:TodoListComponent},
  {path:'lists/:listId',component:TodoListComponent},
  {path:'login',component:LoginPageComponent},
  {path:'signup',component:SignUpComponent},
  // {path:'edit-todo/:listId',component:EditTodoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
