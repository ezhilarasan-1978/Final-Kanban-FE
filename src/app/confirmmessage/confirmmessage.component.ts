import { Component } from '@angular/core';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-confirmmessage',
  templateUrl: './confirmmessage.component.html',
  styleUrls: ['./confirmmessage.component.css']
})
export class ConfirmmessageComponent {
  constructor(private prj:ProjectService){} 
  confirmMsg = this.prj.confirmMsg;

  leave(){
  this.prj.closeBoxForProject=true;
  }

  dlt(){
    this.prj.confirmdlt = true;
   }
}
