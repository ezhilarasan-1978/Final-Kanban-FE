
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../service/project.service';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Project, Task } from '../../assets/Project';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css']
})
export class BoardViewComponent implements OnInit {
  

  projectDetails:any|Project;
  currentCardTaskStatus:any;

// ---------------------------------------------
  constructor(private projectService:ProjectService,
     private snackBar:MatSnackBar, private routing:Router, private user:UserService){}

  ngOnInit(): void {
    let currentUserName=history.state.ProjectName;

    this.projectService.getProject(currentUserName).subscribe(
      response=>{ 
        this.projectDetails=response;
    
      },
      error=>alert("There was error fetching Project Details")    
    )
  }

  // ----Array of arrays for the task;
    
    drop(event: CdkDragDrop<Task[]>) {
      this.getThePriorityTasks();
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
       
        if (event.container.id === "cdk-drop-list-1" && !this.getNumberOfTaskInWIP()) {
          return;
        }
        if (event.container.id === "cdk-drop-list-1" && this.getThePriorityTasks()) {
          alert("inside second logic")
          return;
        }
        transferArrayItem(
          event.previousContainer.data,
          event.container.data as Task[],
          event.previousIndex,
          event.currentIndex
        );
      }
      console.log(this.projectDetails);
      
      // this.projectService.updateProject(this.projectDetails).subscribe(

      //   response=>{console.log(response);
      //   },
      //   error=> {alert("There was error updating the project");
      //   console.log(error);
        
      //   }
      // )
    }

getColumnNames() {
   return Object.keys(this.projectDetails.columns);
}

getColumnTasks(columnName: string) {
    return this.projectDetails.columns[columnName];
  }


// ------------------------------methods for manipulation of content drag and drop

  getNumberOfTaskInWIP(): boolean{
   let num= this.projectDetails.columns["Work In Progress"].length
         return num<=4;
  }

  getThePriorityTasks(){
    let high=0;
    let urgent=0;
    let low=0;
    for(let i =0; i<this.projectDetails.columns["To Be Done"].length;i++){
      if(this.projectDetails.columns["To Be Done"][i].priority=="Urgent"){
        urgent++;
      }
      if(this.projectDetails.columns["To Be Done"][i].priority=="Low"){
        low++;
      }
      if(this.projectDetails.columns["To Be Done"][i].priority=="High"){
        high++;
      }
    }
  
    let sum=low+high;
   
    if(urgent>sum&&this.currentCardTaskStatus!="Urgent"){
    
      sum=0;
      return true;
    } else{
      sum=0;
      return false;
    } 
  }

  onDragStart(task:any){
   
    this.currentCardTaskStatus=task.priority;
  }

  deleteProject(){
    this.user.deleteProject(this.projectDetails.name).subscribe(

      response=> { this.openSnackBar("The project was deleted Successfully", "OK") },
      error=>{
        this.openSnackBar("There wad error deleting the project", "OK")
      }
    )
  }
// -----------------------Delete and Insert task------------------------------
  delete(columnName:any,task:any){
       for(let i=0; i<this.projectDetails.columns[columnName].length;i++){
        if(this.projectDetails.columns[columnName][i].name==task.name){
          this.projectDetails.columns[columnName].splice(i,1);
          this.openSnackBar("The task was deleted successfuly", "OK")

          break;
        }
      }
  }

// ------------------------------------u---------------------------------------
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
    this.routing.navigate(['/project']);

  }
}
