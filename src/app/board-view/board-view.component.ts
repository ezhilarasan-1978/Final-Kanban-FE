
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
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css']
})
export class BoardViewComponent implements OnInit {


  projectDetails: any | Project;
  currentCardTaskStatus: any;
  projectList: any;
  // ---------------------------------------------
  constructor(private projectService: ProjectService,
      private http:HttpClient
    ,
    private snackBar: MatSnackBar, private routing: Router, private user: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {

    let val = this.projectService.getProjectName();

    this.user.getProjectList().subscribe(
      response => {
        this.projectList = response;
        if (val == null) {
          
          if(this.projectList.projectList.length!==0){

            val = this.projectList.projectList[0];
          }
          // --------------------------
         
            const project: Project = {
              name:"Project1",
              members: [this.user.currentUser],
              columns: {}  
            };
          this.projectService.addNewProject(project).subscribe(
  
            response=> {console.log(response);
            
                
                this.http.get(`http://localhost:8007/api/v1/user/updateProject/${this.user.currentUser}/${project.name}`).subscribe(
                 
                response => console.log(response));
  
              },
            
            
            error=>{
             this.openSnackBar(`Project with name ${project.name} already exist`, "OK"); 
            }
          )

          //--------
          
        }
        this.projectService.setProjectName(val);
        this.projectService.getProject(val).subscribe(
          response => {
            this.projectDetails = response;
          },
          error => alert("There was error fetching Project Details")
        )
      },
      error => {
        console.log(error);
      }
    );
  }

  searchText: string = '';
  clearSearch(){
    this.searchText=''; 
  }
  search() {
    if (this.searchText == '') {
      let val = this.projectService.getProjectName();
      this.user.getProjectList().subscribe(
        response => {
          this.projectList = response;
          if (val == null) {
            console.log("test");
            val = this.projectList.projectList[0];
            console.log(val);
          }
          this.projectService.setProjectName(val);
          this.projectService.getProject(val).subscribe(
            response => {
              this.projectDetails = response;
            },
            error => alert("There was error fetching Project Details")
          )
        },
        error => {
          console.log(error);
        }
      );

    }
    else {
      for (let col of Object.entries(this.projectDetails.columns)) {
        let [name, arr] = col as any;
        console.log(name);
        arr = arr.filter((task: Task) => {
          return task.name.startsWith(this.searchText)
          //  return task.name.toLowerCase().includes(this.searchText)
        })
        console.log(arr);
        this.projectDetails.columns[name]=arr
        console.log(this.projectDetails.columns[name]);
      }
    }
    console.log(this.projectDetails.columns);
  }

  // ----Array of arrays for the task;

  drop(event: CdkDragDrop<Task[]>) {
    this.getThePriorityTasks();
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data as Task[],
        event.previousIndex,
        event.currentIndex
      );
    }
    console.log(this.projectDetails);

    this.projectService.updateProject(this.projectDetails).subscribe(
      response => {
        console.log(response);
      },
      error => {
        alert("There was error updating the project");
        console.log(error);
      }
    )
  }

  sortName() {
    for (let col of Object.entries(this.projectDetails.columns)) {
      let [name, arr] = col as any;
      console.log(arr);
      arr = arr.sort((a: any, b: any) => {
        let fa = a.name.toLowerCase(), fb = b.name.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      })
      console.log(arr);
    }
  }
  sortPriority(){
    for (let col of Object.entries(this.projectDetails.columns)) {
      let [name, arr] = col as any;
      console.log(arr);
      const order:any = { Urgent: 0, High: 1, Normal: 2, Low: 3, Clear: 4 };
      console.log(order['Low']);
      arr = arr.sort((a: any, b: any) => 
        order[a.priority] - order[b.priority]        
      )
      console.log(arr);
    }
  }
  getColumnNames() {
    return Object.keys(this.projectDetails.columns);
  }

  getColumnTasks(columnName: string) {
    return this.projectDetails.columns[columnName];
  }
  // ------------------------------methods for manipulation of content drag and drop
  getNumberOfTaskInWIP(): boolean {
    let num = this.projectDetails.columns["Work In Progress"].length
    return num <= 4;
  }

  getThePriorityTasks() {
    let high = 0;
    let urgent = 0;
    let low = 0;
    for (let i = 0; i < this.projectDetails.columns["To Be Done"].length; i++) {
      if (this.projectDetails.columns["To Be Done"][i].priority == "Urgent") {
        urgent++;
      }
      if (this.projectDetails.columns["To Be Done"][i].priority == "Low") {
        low++;
      }
      if (this.projectDetails.columns["To Be Done"][i].priority == "High") {
        high++;
      }
    }
    let sum = low + high;
    if (urgent > sum && this.currentCardTaskStatus != "Urgent") {
      sum = 0;
      return true;
    } else {
      sum = 0;
      return false;
    }
  }

  onDragStart(task: any) {
    this.currentCardTaskStatus = task.priority;
  }

  deleteProject() {
    this.user.deleteProject(this.projectDetails.name).subscribe(
      response => { 
        // this.projectList.projectList=this.projectList.projectList
        this.openSnackBar("The project was deleted Successfully", "OK") 
      },
      error => {
        this.openSnackBar("There wad error deleting the project", "OK")
      }
    )

  }
  // -----------------------Delete and Insert task------------------------------
  delete(columnName: any, task: any) {
    for (let i = 0; i < this.projectDetails.columns[columnName].length; i++) {
      if (this.projectDetails.columns[columnName][i].name == task.name) {
        this.projectDetails.columns[columnName].splice(i, 1);
        this.openSnackBar("The task was deleted successfully", "OK")

        break;
      }
    }
    this.projectService.updateProject(this.projectDetails).subscribe(

      response => {
        console.log(response);
      },
      error => {
        alert("There was error updating the project");
        console.log(error);

      }
    )
  }

  // ------------------------------------u---------------------------------------
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action,{duration:1000});
    // this.routing.navigate(['/project']);
  }

  show: boolean = false;
  load(date: any) { return date?.slice(8, 10); }

  loadA(assigne: any) { return assigne?.slice(0, 1); }

  hide() { this.show = false; }

  unhide(task: any) { this.show = true; }


  projectWindow() {
    this.dialog.open(ProjectComponent);
  }

  taskWindow() {
    this.dialog.open(TaskComponent);
  }
  // -------------------------
  isShowing: boolean = false;

  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  toggleSidenav() {
    alert("this is the side nav")
    this.sidenav.toggle();
  }
  callMethods() {
    this.toggleSidenav();
  }

  boardView(project: string) {
    this.projectService.setProjectName(project);
    this.projectService.getProject(project).subscribe(
      response => {
        this.projectDetails = response;
      },
      error => alert("There was error fetching Project Details")
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
    } else if (value === 'Normal') {
      return 'card-blue';
    } else {
      return '';
    }
  }
  selectedProject(project: string):string{
    if(this.projectService.projectName==project){
      return 'bold'
    }
    return 'projectButton'
  }
}
