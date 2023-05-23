import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from 'src/assets/Project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  
  projectName:any;
  editTask:any;

  setProjectName(name:any){
    this.projectName=name;
  }

  getProjectName(){
    return this.projectName;
  }
// COnfirm message code part 

  confirmMsg:string='';
  confirmdlt?:boolean;

  closeBoxForProject?:boolean=false;

// -------------------------------------

  constructor(private httpClient:HttpClient) {}
  
  baseurl:string="http://localhost:8007/api/v1/project/";
  addNewProject(project:any){
    return this.httpClient.post(this.baseurl+"add", project)
  }

  getProject(projectName:any){
    return this.httpClient.get(this.baseurl+projectName);
  }

  updateProject(project:Project){
    return this.httpClient.put(this.baseurl+`save/${project.name}`, project.columns)
  }
  addNewTask(task:any){
    // let name="Corrected Code"
    return this.httpClient.put(this.baseurl+`task/${this.projectName}`, task)
  }
}
