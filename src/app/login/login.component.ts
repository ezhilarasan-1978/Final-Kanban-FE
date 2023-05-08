import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthserviceService } from '../service/authservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router:Router ,private authService: AuthserviceService,  
    private userService:UserService,
    private _snackBar: MatSnackBar) { }

  loginForm:any|FormGroup;

  loginStatus:boolean=false;

  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  ngOnInit() {

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl('', Validators.required)
    });
  }

  responsedata:any;
  loginCustomer() {
    this.userService.loginUser(this.loginForm.value).subscribe( response=>{
      this.responsedata=response;
      localStorage.setItem("jwt", this.responsedata.Token);
      console.log(response);

      this.loginStatus=true;

      this.openSnackBar("Your Login was successfull", "Ok")  
  
    }, error=> {

      this.openSnackBar("There was error Login Try again", "Ok")  
    })
  }
  logout(){

  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
