import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { User, Message } from '../_Model/index';
import {Eevent} from '../_Model/eevent';
import {MatSnackBar} from '@angular/material';
import * as $ from 'jquery'
import 'bootstrap'
import { error } from 'util';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit,OnDestroy {
  model:any = {};
  messages:any[] = null;
  individualMessages:any[] = null;
  participents:any[] = null;
  text:string = "";
  selectedFile:File = null;
  public static currentActiveChatUser:string = null;
  isFileSelected:boolean = false;
  constructor(private router: Router, private _chatService: ChatService,public snackBar: MatSnackBar) { 
    
  }

  ngOnInit() {
    this.checkSession();
    this.initIoConnection();
  }

  ngOnDestroy() {
  }

  backToChatRoom() {
    console.log(ChatroomComponent.currentActiveChatUser);
    if(ChatroomComponent.currentActiveChatUser !=null)
    {
      document.getElementById(ChatroomComponent.currentActiveChatUser).classList.remove('active_chat');
      ChatroomComponent.currentActiveChatUser = null;
    }
  }
  onFileSelected(event)
  {
    if(event.target.files.length)
    {
      this.isFileSelected = true;
      this.selectedFile = event.target.files[0];
    }
    else {
      this.isFileSelected = false
    }
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
    if(!this.isFileSelected && this.text.trim()==="")
    {
      this.snackBar.open(`cannot send empty message`, "ok");
      return;
    }
    if(this.isFileSelected)
    {
      var msgform = $('#msg_form')[0];
      var formData = new FormData(msgform);
      formData.append('userName', window.localStorage.getItem("current-user"));
      formData.append('chatMsg', this.text);
      $.ajax({
        url: 'http://192.168.34.54:4747/chatroom/img/upload',
        method: 'post',
        enctype: 'multipart/form-data',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response){
          this.text = ''
        }
      });
    }
    else
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
                }
              },
              error => {
                console.error(error);
                return Observable.throw(error);
              });
              this._chatService.getParticepents().subscribe(
                (data:any) => {
                  if(data.check) {
                  }
                  else {
                    this.participents = data.AllUsers;
                  }
                },
                error => {
                  console.error(error);
                  return Observable.throw(error);
                });
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
    
  }

enlargeImage(current)
{
  $('.enlargeImageModalSource').attr('src', current.target.src);
  $('#enlargeImageModal').modal('show');
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

    this._chatService.onEvent(Eevent.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });
      
    this._chatService.onEvent(Eevent.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  logout() {
    window.localStorage.removeItem("current-user");
    this.router.navigate(['/login']);
  }
}