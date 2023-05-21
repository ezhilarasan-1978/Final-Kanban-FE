
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
import { NotificationService } from '../service/notification.service';
import { EditTaskComponent } from '../edit-task/edit-task.component';


@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css']
})
export class BoardViewComponent implements OnInit {
  isSidenavOpen: boolean = true;
  projectDetails: any | Project;
  currentCardTaskStatus: any;
  projectList: any;
  // ---------------------------------------------
  constructor(private projectService: ProjectService, private http: HttpClient, private noti: NotificationService,
    private snackBar: MatSnackBar, private routing: Router, private user: UserService, private dialog: MatDialog) { }
  notifications: any={};

  ngOnInit(): void {
    
    let val = this.projectService.getProjectName();
    this.user.getProjectList().subscribe(
      response => {
        this.projectList = response;
        if (val === null || typeof val === 'undefined') {

          val = this.projectList.projectList[0];
        }
        this.projectService.setProjectName(val);
        this.projectService.getProject(val).subscribe(
          response => {
            this.projectDetails = response;
          },
          error => console.log("There was error fetching Project Details")
        )
      },
      error => {
        console.log(error);
      }
    );
    this.notifications.notificationMessage = {
      'No new Notification': true
    }
    console.log(this.notifications);
  }

  showL: boolean = true;

  showList() {
    this.showL = !this.showL;
  }


  searchText: string = '';
  clearSearch() {
    this.searchText = '';
    this.search();
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
        })
        console.log(arr);
        this.projectDetails.columns[name] = arr
        console.log(this.projectDetails.columns[name]);
      }
    }
    console.log(this.projectDetails.columns);
  }


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
  sortPriority() {
    for (let col of Object.entries(this.projectDetails.columns)) {
      let [name, arr] = col as any;
      console.log(arr);
      const order: any = { Urgent: 0, High: 1, Normal: 2, Low: 3, Clear: 4 };
      console.log(order['Low']);
      arr = arr.sort((a: any, b: any) =>
        order[a.priority] - order[b.priority]
      )
      console.log(arr);
    }
  }
  getNotification() {
    this.noti.getNotification().subscribe(
      response => {
        this.notifications = response;
        // for (let obj of Object.entries(this.notifications.notificationMessage)) {
        //   let [msg, flag] = obj as any;
        // }
      },
      error => {
        alert("Failed to get notification")
      }
    )
  }
  readAll() {
    this.noti.readAllNotifications().subscribe(
      response => {
        console.log("Read all msgs");
      },
      error => {
        alert("Read Notifications Failed")
      }
    )
  }
  readMsg(msg: any) {
    this.noti.readNotifications(msg).subscribe(
      response => {
        console.log("Read msgs");
      },
      error => {
        alert("Read Notification Failed")
      }
    )
  }
  dateToString(date:any){
    let hoursDiff = date.getHours() - date.getTimezoneOffset() / 60;
    let minutesDiff = (date.getHours() - date.getTimezoneOffset()) % 60;
    date.setHours(hoursDiff);
    date.setMinutes(minutesDiff);

    let dateString = JSON.stringify(date)
    dateString = dateString.slice(1, 11);
    return dateString;
  }

  getColumnNames() {
    if (this.projectDetails && this.projectDetails.columns) {
      return Object.keys(this.projectDetails.columns);
    }
    return [];
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
    let urgent = 0;
    for (let i = 0; i < this.projectDetails.columns["To Be Done"].length; i++) {
      if (this.projectDetails.columns["To Be Done"][i].priority == "Urgent") {
        urgent++;
      }
    }
    if (urgent > 5 && this.currentCardTaskStatus != "Urgent") {
      urgent = 0;
      return true;
    } else {
      urgent = 0;
      return false;
    }
  }

  onDragStart(task: any) {
    this.currentCardTaskStatus = task.priority;
  }

  deleteProject(project: any) {
    this.user.deleteProject(project).subscribe(
      response => {
        // this.projectList.projectList=this.projectList.projectList
        this.openSnackBar("The project was deleted Successfully", "OK")
        this.routing.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.routing.navigate(['/boardView']);
        });
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
    this.snackBar.open(message, action, { duration: 3000 });
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
  editTask(task:any){
    this.projectService.editTask=task;
    this.dialog.open(EditTaskComponent);
  }
  // -------------------------
  isShowing: boolean = false;

  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;

  toggleSidenav() {
    this.sidenav.toggle();
    this.isSidenavOpen = !this.isSidenavOpen;

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
  selectedProject(project: string): string {
    if (this.projectService.projectName == project) {
      return 'bold'
    }
    return 'projectButton'
  }
  seenUnseen(flag: any): string {
    if (flag == false) {
      return 'notiSeen';
    }
    else {
      return 'notiUnSeen'
    }
  }
}