import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private authService:AuthService,private router:Router) { }

  ngOnInit(): void {
  }
 
  onsignupButtonClicked(email:string,password:string){

    this.authService.signup(email,password).subscribe((res:HttpResponse<any>)=>{
      if (res.status === 200) {
        // we have logged in successfully
        this.router.navigate(['/lists']);
      }
    });
  }
}
