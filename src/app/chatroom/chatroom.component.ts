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
  constructor(private router: Router, private _chatService: ChatService,public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.initIoConnection();
  }



  public openPopup: Function;
  public form: FormGroup;
    setPopupAction(fn: any) {
        this.openPopup = fn;
  }

  private initIoConnection(): void {

    this._chatService.onNewUserJoined()
      .subscribe((data:any) => {
        console.log(data);
        console.log(data['userName']);
        this.snackBar.open(`${data['userName']} Joined chat room!!!`, "ok", {
          duration: 2000,
        });
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
  
}
