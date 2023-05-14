import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Task } from 'src/assets/Project';
import { Router } from '@angular/router';
import { ProjectService } from '../service/project.service';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {


  priorityColor: any;
  constructor(private fb: FormBuilder, private routing: Router, private projectService: ProjectService) { }
  ngOnInit(): void {
    this.setPriority("Clear");
  }

  public currentDate: Date = new Date();
  createDate: any;
  user: any = localStorage.getItem("currentUser");


  setDate() {
    console.log(this.startDate!.value)
    this.createDate = this.startDate?.value
    console.log(typeof (this.createDate));
    
    let hoursDiff = this.createDate.getHours() - this.createDate.getTimezoneOffset() / 60;
    let minutesDiff = (this.createDate.getHours() - this.createDate.getTimezoneOffset()) % 60;
    this.createDate.setHours(hoursDiff);
    this.createDate.setMinutes(minutesDiff);

    console.log(JSON.stringify(this.createDate));
    this.createDate = JSON.stringify(this.createDate)
    this.createDate = this.createDate.slice(1, 11)
    console.log(this.createDate);


  }

  AddTask = this.fb.group({
    taskName: ['', Validators.required],
    taskContent: ['', Validators.required],
    taskPriority: [''],
    startDate: [''],
    dueDate: [''],
    members: [[]]
  })

  membersList: string[] = ['Priyanshu', 'Ezhil', 'Mahek']; //list of registered users - user 


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


    const task: any = {
      name: this.taskName?.value,
      content: this.taskContent?.value,
      priority: this.priorityColor,
      createDate: this.createDate,
      deadline: this.dueDate?.value,
      assignee: this.user,
      members: this.members?.value
    };
    this.projectService.addNewTask(task).subscribe(
      repsonse => {
        console.log(repsonse)
        // this.AddTask.reset();
      }
      ,
      error => console.log(error)

    );
    this.onClose()
  }

  onClose() {
    // this.AddTask.reset();
    this.routing.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.routing.navigate(['/boardView']);
    });
  }
}