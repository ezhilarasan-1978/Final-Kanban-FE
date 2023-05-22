import { Component, ViewChild } from '@angular/core';
import { UserService } from '../service/user.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthserviceService } from '../service/authservice.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private user:UserService, private breakPoint:BreakpointObserver, private routing:Router, private authentication: AuthserviceService){}

  loggedUser:string='';
  currentUser:boolean=false;
  DeskTopView:boolean=false;


  ngOnInit(){
    this.breakPoint.observe([Breakpoints.Handset]).subscribe(

      result=>{
        this.DeskTopView=!result.matches;
      }
    )
  }

  ngDoCheck(){
    
  this.loggedUser = this.user.currentUser;
    if(typeof this.loggedUser!=='undefined'&&this.user.currentUser.length>0){
      this.currentUser=true;
    }

  }

  logOut(){
    this.authentication.setLogOutStatus();
    this.user.setUser('')
    this.currentUser=false;
    this.routing.navigate([`/login`])
  }
}


