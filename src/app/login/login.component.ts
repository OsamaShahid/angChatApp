import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { ChatService } from '../chat.service';
import {MatDialog} from "@angular/material"
import { MessagedialogComponent } from '../messagedialog/messagedialog.component';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { User } from '../_Model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model : any = {};
  constructor(private router: Router, private _chatService: ChatService, public dialog : MatDialog,@Inject(PLATFORM_ID) private platformId: Object) {
    
   }

  ngOnInit() {
    this.checkSession();
  }
  checkSession() {
    this.model.username =  window.localStorage.getItem("current-user");
    console.log(this.model.Username);
    this._chatService.validateSession(this.model).subscribe(
      (data:any) => {
        if(data.check) {
        }
        else {
          this.router.navigate(['/chatroom']);
        }
        return true;
      },
      error => {
        console.error(error);
        return Observable.throw(error);
      }
    );
  }
  showError(msg : string) : void {
    this.dialog.open(MessagedialogComponent, {
      data: {
        error: msg
      } ,width : '400px', height: '200px'
    });
  }

  loginUser() {
    this._chatService.login(this.model).subscribe(
        (data:any) => {
          if(data.check) {
            this.showError("Username or passworfd is incorrect!!!");
          }
          else {
            if (isPlatformBrowser(this.platformId)) {
              window.localStorage.setItem("current-user",data[0]['userName']);
            }
            this.router.navigate(['/chatroom']);
          }
          return true;
        },
        error => {
          console.error(error);
          return Observable.throw(error);
        }
    );
  }
}
