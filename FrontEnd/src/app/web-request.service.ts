import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class WebRequestService {
readonly ROOTE_URL;
  constructor(private http:HttpClient) { 
    this.ROOTE_URL='http://localhost:3000';
  }
  get(uri:string){
     return this.http.get(`${this.ROOTE_URL}/${uri}`);
  }
  post(uri:string,payload:object){
    return this.http.post(`${this.ROOTE_URL}/${uri}`,payload);
  }
  patch(uri:string,payload:object){
    return this.http.patch(`${this.ROOTE_URL}/${uri}`,payload);
  }
  delete(uri:string){
    return this.http.delete(`${this.ROOTE_URL}/${uri}`);
  }
  login(email:string,password:string){
    return this.http.post(`${this.ROOTE_URL}/users/login`,{
      email,
      password
    },{observe:'response'})
    console.log("hi")
  }
  signup(email:string,password:string){
    return this.http.post(`${this.ROOTE_URL}/users`,{
      email,
      password
    },{observe:'response'})
  }


}
