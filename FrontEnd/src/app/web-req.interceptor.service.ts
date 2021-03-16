import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Observable, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { Observable, throwError, empty, Subject } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService) { }
  refreshingAccessToken: boolean;

  accessTokenRefreshed: Subject<any> = new Subject();
  intercept(request:HttpRequest<any>,next:HttpHandler):Observable<any>{
    request= this.addAuthHeader(request);
    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse)=>{
        console.log(error);
        alert("invalid email or password");
      //  console.log("boss sayed hiiiii how are u the big boss ??")
        // return throwError(error);
        if(error.status === 401){
          //refresh the access token
          // console.log("test");
          // this.authService.logout();
          return this.refreshAccessToken()
          .pipe(
            switchMap(() => {
              request = this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err: any) => {
              console.log(err);
              this.authService.logout();
              return empty();
            })
          )
        }
        return throwError(error);
        
        
      })
    )
  }
  addAuthHeader(request:HttpRequest<any>){
    const token = this.authService.getAccessToken();
    if(token){
      return request.clone({
        setHeaders:{
        'x-access-token':token
        }
      })
    }
    return request;
  }
  refreshAccessToken() {
    if (this.refreshingAccessToken) {
      return new Observable(observer => {
        this.accessTokenRefreshed.subscribe(() => {
          // this code will run when the access token has been refreshed
          observer.next();
          observer.complete();
        })
      })
    } else {
      this.refreshingAccessToken = true;
      // we want to call a method in the auth service to send a request to refresh the access token
      return this.authService.getNewAccessToken().pipe(
        tap(() => {
          console.log("Access Token Refreshed!");
          this.refreshingAccessToken = false;
          this.accessTokenRefreshed.next();
        })
      )
    }
    
  }
}
