import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProjectComponent } from './project/project.component';
import { BoardViewComponent } from './board-view/board-view.component';
import { TaskComponent } from './task/task.component';
import { AuthGuardGuard } from './service/auth-guard.guard';
import { CanDeactivatedTeam } from './service/can-deactivate-guard.guard';

const routes: Routes = [
  {path:'', redirectTo:'/login', pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'project', component:ProjectComponent, canDeactivate:[CanDeactivatedTeam]},
  // {path:'boardView', component:BoardViewComponent, canActivate:[AuthGuardGuard] }
  {path:'boardView', component:BoardViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
