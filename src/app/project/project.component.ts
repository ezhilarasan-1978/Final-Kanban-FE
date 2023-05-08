import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Project } from 'src/assets/Project';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {

  projectForm:any| FormGroup;

  constructor(private formBuilder: FormBuilder, private user:UserService) { }

  ngOnInit() {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      members: [[]],
      memberName: ['']
    });
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

  findUserName:any;
  addMember() {
    this.user.findUserCustomer(this.memberName.value.trim()).subscribe(
      response=>{
        this.findUserName=response;
        console.log("This si response"+response);
        
      },
      error=>{console.log("This is error"+error);
      }
    )

    console.log("This is the status of findusername boolean"+this.findUserName);
    
    if (this.findUserName) {
      this.members.value.push(this.memberName.value.trim());
      this.memberName.setValue('');
      this.findUserName=false;
    }
  }

  addProject() {
    if (this.projectForm.valid) {
      const project: Project = {
        name: this.name.value,
        members: this.members.value,
        columns: {}
 
      };
      console.log(project);
    }
  }

}

