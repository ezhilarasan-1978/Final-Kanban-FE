import { Component } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import {CustomValidation} from '../service/CustomValidation';
import { UserService } from '../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private userService:UserService, private fb:FormBuilder
    , private matSnackBar:MatSnackBar, private routing: Router
    ) { }

    phonePattern = /^[7-9]\d{9}$/;
    emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      password: ['' ,[Validators.required]],
      Cpassword: ['', Validators.required],
      name:['', Validators.required],
      projectList: new FormArray([])
    }, {
      validators: [CustomValidation.passwordMatchValidator]
    });

    get getEmail() {
      return this.registerForm.get('email');
    }
    
    get getPhone() {
      return this.registerForm.get('phone');
    }
    
    get getPassword() {
      return this.registerForm.get('password');
    }
    
    get getCPassword() {
      return this.registerForm.get('Cpassword');
    }
    
    get getName() {
      return this.registerForm.get('name');
    }

      // ------------- Code to register the customer finally-------------------------------------
  responsedata:any;
  registerCustomer() {
    console.log(this.registerForm.value);
    this.userService.regsiterCustomer(this.registerForm.value).subscribe( response=>{


      this.routing.navigate(['/login'])

    }, error=> alert(error))


    this.openSnackBar("Your Account Was Created Succesfully Kindly Login Using Credentials", "Ok");
  }

  openSnackBar(message: string, action: string) {
    this.matSnackBar.open(message, action);
    // this.routing.navigate(['/loginComponent']);

  }
}
