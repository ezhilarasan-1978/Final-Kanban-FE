import { Component, ViewChild } from '@angular/core';
import { UserService } from '../service/user.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthserviceService } from '../service/authservice.service';
import { ProjectService } from '../service/project.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private user: UserService, private breakPoint: BreakpointObserver, private routing: Router, private authentication: AuthserviceService,
    private project: ProjectService) { }

  loggedUser: string = '';
  currentUser: boolean = false;
  DeskTopView: boolean = false;

  ngOnInit() {
    this.breakPoint.observe([Breakpoints.Handset]).subscribe(
      result => {
        this.DeskTopView = !result.matches;
      }
    )
  }

  ngDoCheck() {
    this.loggedUser = this.user.getUser();
    if (typeof this.loggedUser !== 'undefined' && this.user.getUser().length > 0) {
      this.currentUser = true;
    } else {
      this.currentUser = false;
    }
  }

  logOut() {
    this.authentication.setLogOutStatus();
    this.user.setUser('')
    this.currentUser = false;
    this.project.setProjectName(undefined);
    this.routing.navigate([`/login`])
  }
}