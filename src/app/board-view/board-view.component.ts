
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../service/project.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Project, Task } from '../../assets/Project';

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css']
})
export class BoardViewComponent implements OnInit {
  
  projectDetails:any|Project;

  constructor(private projectService:ProjectService){}

  ngOnInit(): void {
    this.projectService.getProject("BoardView").subscribe(
      response=>{ 
        this.projectDetails=response;
        console.log('-----------------------------');
      },
      error=>alert("There was error fetching Project Details")    
    )
  }

  // ----Array of arrays for the task;

    // --------------------------------------------


drop(event: CdkDragDrop<Task[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data as Task[],
      event.previousIndex,
      event.currentIndex,
    );
  }
  console.log(this.projectDetails);
  
}


getColumnNames() {
   return Object.keys(this.projectDetails.columns);
}

getColumnTasks(columnName: string) {
    return this.projectDetails.columns[columnName];
  }
}
