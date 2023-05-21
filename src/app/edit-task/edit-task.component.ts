import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../service/project.service';
import { Project } from 'src/assets/Project';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  priorityColor: any;

  projectMembers: string[] = [];

  project: any;

  constructor(private fb: FormBuilder, private routing: Router, private projectService: ProjectService,private user1: UserService) { }
  ngOnInit(): void {
    this.projectService.getProject(this.projectService.projectName).subscribe(data => { this.project = data; this.projectMembers = this.project.members });
    this.currentTask = this.projectService.editTask;
    this.setPriority(this.currentTask.priority);
    this.AddTask = this.fb.group({
      taskName: [this.currentTask.name, Validators.required],
      taskContent: [this.currentTask.content, Validators.required],
      taskPriority: [this.currentTask.priority],
      startDate: [this.currentTask.createDate],
      dueDate: [this.currentTask.deadline],
      members: [this.currentTask.members]
    })
    this.currentDate=this.currentTask.createDate;
    let val = this.projectService.getProjectName();

    this.user1.getProjectList().subscribe(
      (response: any) => {
        this.projectList = response;
        if (val === null || typeof val === 'undefined') {
          val = this.projectList.projectList[0];
        }
        this.projectService.setProjectName(val);
        this.projectService.getProject(val).subscribe(
          response => {
            this.projectDetails = response;
            console.log(this.projectDetails)
          },
          error => console.log("There was error fetching Project Details")
        )
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  membersList: string[] = [];
  currentTask: any = '';

  public currentDate: Date = new Date();
  createDate: any;
  createDate1: any;
  deadline: any;
  user: any = localStorage.getItem("currentUser");


  setDate() {
    console.log(typeof(this.currentTask.createDate))
    console.log(typeof(this.startDate))
    console.log(this.startDate)
    console.log(typeof(this.startDate?.value))
    console.log(this.startDate?.value)
    this.createDate = this.startDate?.value
    let hoursDiff = this.createDate.getHours() - this.createDate.getTimezoneOffset() / 60;
    let minutesDiff = (this.createDate.getHours() - this.createDate.getTimezoneOffset()) % 60;
    this.createDate.setHours(hoursDiff);
    this.createDate.setMinutes(minutesDiff);
  }
  AddTask: FormGroup = this.fb.group({
    taskName: [this.currentTask.name, Validators.required],
    taskContent: ['', Validators.required],
    taskPriority: [''],
    startDate: [''],
    dueDate: [''],
    members: [[]]
  })
  projectDetails: any | Project;
  projectList: any;



  get AddForm() { return this.AddTask }
  get taskName() { return this.AddTask.get("taskName") }

  get taskContent() { return this.AddTask.get("taskContent") }

  get taskPriority() { return this.AddTask.get("taskPriority") }

  get startDate() { return this.AddTask.get("startDate") }

  get dueDate() { return this.AddTask.get("dueDate") }

  get members() { return this.AddTask.get("members") }

  setPriority(colorCode: any) {
    this.priorityColor = colorCode;
  }

  onSubmit() {
    this.deadline = this.dueDate?.value

    if(this.AddForm.get('dueDate')?.dirty){
      let hoursDiff = this.deadline.getHours() - this.deadline.getTimezoneOffset() / 60;
      let minutesDiff = (this.deadline.getHours() - this.deadline.getTimezoneOffset()) % 60;
      this.deadline.setHours(hoursDiff);
      this.deadline.setMinutes(minutesDiff);
    }


    // this.deadline = JSON.stringify(this.deadline)
    // this.deadline = this.deadline.slice(1, 11);

    const updatedTask: any = {
      name: this.taskName?.value,
      content: this.taskContent?.value,
      priority: this.priorityColor,
      createDate: this.startDate?.value,
      deadline: this.deadline,
      assignee: this.user,
      members: this.members?.value
    };
    console.log(this.projectDetails.columns);
    for (let col of Object.entries(this.projectDetails.columns)) {
      let [name, arr] = col as any;
      arr=arr.map((task:any)=>{
        if(task.name===this.currentTask.name && task.content===this.currentTask.content){
          console.log('match');
          return updatedTask;
        }  
        return task;
      })
      this.projectDetails.columns[name] = arr
    }
    console.log(this.projectDetails.columns);
    this.projectService.updateProject(this.projectDetails).subscribe(
      response => {
        console.log(response);
      },
      error => {
        alert("There was error updating the project");
        console.log(error);
      }
    )
    this.onClose()
  }

  onClose() {
    this.routing.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.routing.navigate(['/boardView']);
    });
  }
  isFormDisabled: boolean = false;
  disableForm() {
    console.log('disable');
    
    if(!this.isFormDisabled){
      this.AddForm.disable()
    }
    else{
      this.AddForm.enable()
    }
    this.isFormDisabled = !this.isFormDisabled
  }
}
