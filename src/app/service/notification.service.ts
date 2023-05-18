import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private httpClient:HttpClient,private user:UserService) { }
   url='http://localhost:8090/api/v1/notifications/Priyanshu';

   getNotification(){
    return this.httpClient.get('http://localhost:8090/api/v1/notifications/'+localStorage.getItem('currentUser'));
  }
}
