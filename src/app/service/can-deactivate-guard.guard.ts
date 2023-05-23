import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectComponent } from '../project/project.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivatedTeam implements CanDeactivate<ProjectComponent> {
  
  canDeactivate(
    component: ProjectComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
    ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return component.canExit();
    }
    
}
