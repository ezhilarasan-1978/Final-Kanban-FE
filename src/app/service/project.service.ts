import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient:HttpClient) {}
  
  baseurl:string="http://localhost:8007/api/v1/project/";
  addNewProject(project:any){
    return this.httpClient.post(this.baseurl+"add", project)
  }


}
