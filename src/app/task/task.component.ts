import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {

  constructor(private fb: FormBuilder) { }

  public currentDate: Date = new Date(); 
  createDate:any = new Date();
  user:string="Mahek";


  setDate(){
    console.log(this.startDate?.value)
    this.createDate = this.startDate?.value;
  }
  
  priority:string="Clear";

  AddTask = this.fb.group({
    taskName: ['', Validators.required],
    taskContent: ['', Validators.required],
    taskPriority: [this.priority],
    startDate: [''],
    dueDate: [''],
    members: ['']
  })

   membersList: string[] = ['Priyanshu','Ezhil','Mahek']; //list of registered users - user 

 
  get taskName() { return this.AddTask.get("taskName") }

  get taskContent() { return this.AddTask.get("taskContent") }

  get taskPriority() { return this.AddTask.get("taskPriority") }

  get startDate() { return this.AddTask.get("startDate") }

  get dueDate() { return this.AddTask.get("dueDate") }

  get members() { return this.AddTask.get("members") } 

  OnSubmit() { 

  }

}