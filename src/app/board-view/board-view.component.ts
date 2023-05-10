
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../service/project.service';
@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css']
})
export class BoardViewComponent implements OnInit {
  
  constructor(private projectService:ProjectService){}

  ngOnInit(): void {
    this.projectService.getProject("BoardView").subscribe(
      response=>{ console.log(response);
      },
      error=>alert("There was error fetching Project Details")    
    )

  }



}
