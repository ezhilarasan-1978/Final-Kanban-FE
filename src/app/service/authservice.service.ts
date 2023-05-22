import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor() { }

  loginStatus:boolean=false;

  getLoginStatus(){
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
