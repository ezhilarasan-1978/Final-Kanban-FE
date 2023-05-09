import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Project } from 'src/assets/Project';
import { UserService } from '../service/user.service';
import { ProjectService } from '../service/project.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {

  projectForm:any| FormGroup;

  constructor(private routes:Router ,private formBuilder: FormBuilder, private user:UserService, private project:ProjectService, private http:HttpClient) { }

  ngOnInit() {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      members: [[]],
      memberName: [''],
      columns:[[]],
      columnName:['']
    });
  }
  addColumn(){
    if(this.columnName.value.trim().length>0){
      this.columns.value.push(this.columnName.value.trim());
      this.columnName.setValue('');
    }
   
  }

  get name() {
    return this.projectForm.get('name');
  }

  get members() {
    return this.projectForm.get('members');
  }

  get memberName() {
    return this.projectForm.get('memberName');
  }

  get columns(){
    return this.projectForm.get('columns')
  }

  get columnName(){
    return this.projectForm.get('columnName')
  }

  findUserName:any;
  addMember() {
    this.user.findUserCustomer(this.memberName.value.trim()).subscribe(
      response=>{
        this.findUserName=response;  
        if (this.findUserName) {
          this.members.value.push(this.memberName.value.trim());
          this.memberName.setValue('');
          this.findUserName=false;
        }      
      },
      error=>{console.log("This is error"+error);
      }
    )    
  }

  addProject() {
    let count=0;
    const columnList:Map<string, any[]>=new Map();
    for(let i=0;i<this.columns.value.length;i++){
      columnList.set(this.columns.value[i],[])
      count++;
    }
    
    if (this.projectForm.valid) {
      const project: Project = {
        name: this.name.value,
        members: this.members.value,
        columns: Object.fromEntries(columnList.entries())
 
      };
      
      this.project.addNewProject(project).subscribe(

        response=> {console.log(response);;
          for(let i=0; i<this.members.value.length; i++){
         
            this.http.get(`http://localhost:8007/api/v1/user/updateProject/${this.members.value[i]}/${project.name}`).subscribe(
              response => console.log(response));
          }
        },
        eroror=>{alert("error inserting projects")}
      )
      this.routes.navigate(['/login']);
    }
  }

}

