import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Project } from 'src/assets/Project';
import { UserService } from '../service/user.service';
import { ProjectService } from '../service/project.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {

  projectForm:any| FormGroup;

  projectList:any;

  primary:any="accent";
  secondary:any="warn";
  // availableColors = [
  //   {name: 'none', color: undefined},
  //   {name: 'Primary', color: 'primary'},
  //   {name: 'Accent', color: 'accent'},
  //   {name: 'Warn', color: 'warn'},
  // ];

  constructor(private snackBar:MatSnackBar ,private routes:Router ,private formBuilder: FormBuilder, private user:UserService, private project:ProjectService, private http:HttpClient) { }
  
  currentUserName:any;
  ngOnInit() {
    this.user.getUser();

    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      members: [[]],
      memberName: [''],
      columns:[[]],
      columnName:['']
    });

    this.user.getProjectList().subscribe(
      response=>{
        this.projectList=response;
      },
      error=>{console.log(error);
      }
    );
      
    this.columns.value.push("To Be Done");
    this.columns.value.push("Work In Progress");
    this.columns.value.push("Completed");
  }


  addColumn(){
    if(!this.columns.value.includes(this.columnName.value.trim())&&this.columnName.value.trim().length>0){
      this.columns.value.push(this.columnName.value.trim());
      this.columnName.setValue('');
    }else{
      this.openSnackBar("Empty or Duplicate Columns Not Allowed", "Ok");
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
          if(this.members.value.length<=5){
            if(!this.members.value.includes(this.memberName.value.trim()))
          {
            this.members.value.push(this.memberName.value.trim());
            this.memberName.setValue('');
            this.findUserName=false; 
          }
          }else{
            this.openSnackBar("Cannot Add more than 5 Employees to a Project", "Ok");
          }
        }      
      },
      error=>{console.log("This is error"+error);
      }
    )    
  }

  addProject() {

    console.log("This is the current user"+this.user.currentUser);
    
    if(this.members.value.length===0){
  
      this.members.value.push(this.user.currentUser);
    }

    if(!this.members.value.includes(this.user.currentUser)){
  
      this.members.value.push(this.user.currentUser);

    }

    //  ---------------------------------------------------------------------------
      if(this.columns.value.length<2){
        this.openSnackBar("There must be atleast 2 columns", "Got-It")
      }else{
        
        const columnList:Map<string, any[]>=new Map();
        for(let i=0;i<this.columns.value.length;i++){
          columnList.set(this.columns.value[i],[])
        }

        if (this.projectForm.valid) {
          const project: Project = {
            name: this.name.value,
            members: this.members.value,
            columns: Object.fromEntries(columnList.entries())    
          };
        this.project.addNewProject(project).subscribe(

          response=> {console.log(response);
            for(let i=0; i<this.members.value.length; i++){
              
              this.http.get(`http://localhost:8007/api/v1/user/updateProject/${this.members.value[i]}/${project.name}`).subscribe(
               
              response => console.log(response));

            this.openSnackBar("Project added Successfuly", "OK");   
            this.routes.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.routes.navigate(['/boardView']);
            });
            }
          },
          error=>{
           this.openSnackBar(`Project with name ${project.name} already exist`, "OK"); 
          }
        )
        this.routes.navigate(['/boardView'], { state: { ProjectName: project.name} } )
      }
      }  
  }

  openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action);
      }
// -----------------------------------------
    boardView(project:string){
      this.project.setProjectName(project);
      this.routes.navigate(['/boardView'] );
    }
// ----------------------------

}

