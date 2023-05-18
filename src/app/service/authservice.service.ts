import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor() { }

  loginStatus:boolean=false;

  getLoginStatus(){
    alert(`getter msg ${this.loginStatus}`);
    return this.loginStatus;
 
  }

  setLoginStatus(){
    this.loginStatus = true;
  }

  setLogOutStatus(){
    this.loginStatus = false;
    alert(this.loginStatus);
  }

}
