import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EditTodoComponent } from './components/edit-todo/edit-todo.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { NewListComponent } from './components/new-list/new-list.component';
import { NewTodoComponent } from './components/new-todo/new-todo.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { WebReqInterceptor } from './web-req.interceptor.service';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { EditListComponent } from './components/edit-list/edit-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    NewListComponent,
    NewTodoComponent,
    LoginPageComponent,
    SignUpComponent,
    EditTodoComponent,
    EditListComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
