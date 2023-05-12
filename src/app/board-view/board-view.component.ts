
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../service/project.service';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Project, Task } from '../../assets/Project';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectComponent } from '../project/project.component';
import { TaskComponent } from '../task/task.component';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css']
})
export class BoardViewComponent implements OnInit {
  

  projectDetails:any|Project;
  currentCardTaskStatus:any;
  projectList:any;
// ---------------------------------------------
  constructor(private projectService:ProjectService,
     private snackBar:MatSnackBar, private routing:Router, private user:UserService, private dialog:MatDialog){}

  ngOnInit(): void {

    
  
    // let val=this.projectService.getProjectName();

    // if(val==null){
    //   this.user.getProjectList().subscribe(
    //     response=>{
    //       this.projectList=response;
    //       val=this.projectList[0];
    //       this.projectService.setProjectName(val);
    //     //  -----------------------
    //     this.projectService.getProject(val).subscribe(
    //       response=>{ 
    //         this.projectDetails=response;
    //         console.log("second service");
    
    //       },
    //       error=>alert("There was error fetching Project Details")    
    //     )

    //     // -----
    //     },
    //     error=>{console.log(error);
    //     }
    //   );

    // }else{
    //   this.projectService.getProject(val).subscribe(
    //     response=>{ 
    //       this.projectDetails=response;
    //       console.log("second service");
  
    //     },
    //     error=>alert("There was error fetching Project Details")    
    //   )
    // }
    let val=this.projectService.getProjectName();

    this.user.getProjectList().subscribe(
      response=>{
          this.projectList=response;
        
        if(val==null){
          val=this.projectList[0];
        }
          this.projectService.setProjectName(val);
          
          this.projectService.getProject(val).subscribe(
          response=>{ 
            this.projectDetails=response;
          },
          error=>alert("There was error fetching Project Details")    
        )
        },
        error=>{console.log(error);
        }
      );
    
 
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
      
      this.projectService.updateProject(this.projectDetails).subscribe(

        response=>{console.log(response);
        },
        error=> {alert("There was error updating the project");
        console.log(error);
        
        }
      )
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
          this.openSnackBar("The task was deleted successfully", "OK")

          break;
        }
      }
      this.projectService.updateProject(this.projectDetails).subscribe(

        response=>{console.log(response);
        },
        error=> {alert("There was error updating the project");
        console.log(error);
        
        }
      )
  }

// ------------------------------------u---------------------------------------
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
    // this.routing.navigate(['/project']);

  }

  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  show:boolean=false;
  load(date:any){ return date?.slice(8,10); }

  loadA(assigne:any){ return assigne?.slice(0,1); }
  
  hide(){ this.show=false; }
  
  unhide(task:any){ this.show=true; }

  
    projectWindow(){
      this.dialog.open(ProjectComponent);
    }
    
    taskWindow(){
      this.dialog.open(TaskComponent);      
    }

// -------------------------
  isShowing: boolean=false;

  
  @ViewChild('sidenav', {static: true}) sidenav!: MatSidenav;
  toggleSidenav() {
    this.sidenav.toggle();
  }  
  callMethods() {
    this.toggleSidenav();
}

boardView(project:string){
  this.projectService.setProjectName(project);
  this.projectService.getProject(project).subscribe(
    response=>{ 
      this.projectDetails=response;
      console.log("second service");

    },
    error=>alert("There was error fetching Project Details")    
  )
  // this.routing.navigate(['/boardView'], { state: { ProjectName: project} } )
}

getColorClass(value: string): string {
  if (value === 'Urgent') {
    return 'card-red';
  } else if (value === 'High') {
    return 'card-yellow';
  } else if (value === 'Low') {
    return 'card-grey';
  } else if (value=== 'Normal'){
    return 'card-blue';
  }else {
    return '';
  }
}

}
