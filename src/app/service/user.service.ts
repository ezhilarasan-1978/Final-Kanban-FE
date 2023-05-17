import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient) {}

  currentUser:any;

  setUser(name:any){
    this.currentUser=name;
  }
  getUser(){
    return this.currentUser;
  }

  baseUrl:string ="http://localhost:3033/api/v1/auth";
  baseurl2:string="http://localhost:8007/api/v1/user/";


  loginUser(loginData:any){
    return this.httpClient.post(this.baseUrl+"/login", loginData);
  }
  regsiterCustomer(userData:any){
    return this.httpClient.post('http://localhost:8007/api/v1/user/register', userData );
  }

  findUserCustomer(name:string){
    return this.httpClient.get(this.baseUrl+"/findUser/"+`${name}`);
  }

  // getProjectList(){
  //   const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem("jwt")}` })

  //   return this.httpClient.get(this.baseurl2+"projectList", {headers})
  // }
  getProjectList(){
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem("jwt")}` })

    return this.httpClient.get(this.baseurl2+"details", {headers})
  }
  
  deleteProject(projectName:string){
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem("jwt")}` })

    return this.httpClient.get(this.baseurl2+ `removeProject/${projectName}`, {headers})
  }

  getAllUsers(){
    return this.httpClient.get(this.baseUrl+ '/registeredUsers');
  }
}

