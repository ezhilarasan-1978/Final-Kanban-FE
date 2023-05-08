import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient) {}

  baseUrl:string ="http://localhost:3033/api/v1/auth";

  loginUser(loginData:any){
    return this.httpClient.post(this.baseUrl+"/login", loginData);
  }
  regsiterCustomer(userData:any){
    return this.httpClient.post('http://localhost:8007/api/v1/user/register', userData );
  }
}
