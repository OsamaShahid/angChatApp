import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { User, Message } from '../_Model/index';
import {Event} from '../_Model/event';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit,OnDestroy {
  model:any = {};
  messages:any[];
  participents:any[];
  text:string = "";
  constructor(private router: Router, private _chatService: ChatService,public snackBar: MatSnackBar) { 
    
  }

  ngOnInit() {
    this.checkSession();
    this.initIoConnection();
  }

  ngOnDestroy() {
  }

  public getUser(name:String) : boolean
  {
    if (window.localStorage.getItem("current-user") == name)
    {
      return true;
    }
    return false
  }

  public checkClick() 
  {
    var newMsg = {
      name: window.localStorage.getItem("current-user"),
      chat: this.text
    };
    this.text = "";
    this._chatService.broadCastMsg(newMsg).subscribe(
      data => {
        return true;
      },
      error => {
        console.error(error);
        return Observable.throw(error);
      }
    );
  }
  checkSession() {
    if(window.localStorage.getItem("current-user") == null)
    {
      this.router.navigate(['/login']);
    }
    else {
      this.model.Username =  window.localStorage.getItem("current-user");
      console.log(this.model.Username);
      this._chatService.validateSession(this.model).subscribe(
        (data:any) => {
          if(data.check) {

          }
          else {
            this._chatService.getMessagesAndParticepents().subscribe(
              (data:any) => {
                if(data.check) {
          
                }
                else {

                  this.messages = data.chatsToSend;
                  this.participents = data.usersToSend;
                  console.log(this.messages,this.participents);
                }
                return true;
              },
              error => {
                console.error(error);
                return Observable.throw(error);
              }
            );
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



  public openPopup: Function;
  public form: FormGroup;
    setPopupAction(fn: any) {
        this.openPopup = fn;
  }

  private initIoConnection(): void {

    this._chatService.onNewUserJoined()
      .subscribe((data:any) => {
        if(window.localStorage.getItem("current-user") != data[0]['userName'] && window.localStorage.getItem("current-user")!=null)
        {
          this.snackBar.open(`${data[0]['userName']} Joined chat room!!!`, "ok", {
            duration: 2000,
          });
        }
      });

      this._chatService.onBroadCastMsg()
      .subscribe((data:any) => {
        this.messages.push(data);
      });

    this._chatService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });
      
    this._chatService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  logout() {
    window.localStorage.removeItem("current-user");
    this.router.navigate(['/login']);
  }
  
}
