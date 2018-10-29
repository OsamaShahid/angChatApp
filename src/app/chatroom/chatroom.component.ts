import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { User, Message,Individualchats } from '../_Model/index';
import {Eevent} from '../_Model/eevent';
import {MatSnackBar} from '@angular/material';
import * as $ from 'jquery'
import 'bootstrap'
import { error } from 'util';
interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit,OnDestroy {
  
  // data members for storing data comming through api calls
  model:any = {};
  messages:any[] = null;
  individualMessages:Array<Individualchats>;
  participents:any[] = null;
  text:string = "";
  selectedFile:File = null;
  isIndvidualchatActive:boolean = false;
  public static currentActiveChatUser:string = null;
  isFileSelected:boolean = false;
  isNewConversation:boolean = false;
  
  constructor(private router: Router, private _chatService: ChatService,public snackBar: MatSnackBar) { 
    
  }

  ngOnInit() {
    this.checkSession();
    this.initIoConnection();
    this.individualMessages = new Array<Individualchats>();
  }

  ngOnDestroy() {
  }

  backToChatRoom() {
    if(window.localStorage.getItem("current-active-user") !=null)
    {
      this.isIndvidualchatActive = false;
      ChatroomComponent.currentActiveChatUser = window.localStorage.getItem("current-active-user");
      document.getElementById(ChatroomComponent.currentActiveChatUser).classList.remove('active_chat');
      ChatroomComponent.currentActiveChatUser = null;
      window.localStorage.removeItem("current-active-user");
    }
  }

  ondragover(event:Event) {
    event.preventDefault();
  }

  ondragenter(event:Event) {
    event.preventDefault();
  }
  
  ondrop(event:DragEvent) {
    event.preventDefault();
    var el = (<HTMLInputElement>document.getElementById('img_input'));
    el.files =  event.dataTransfer.files;
  }

  // Make the app aware that now individual chat is active
  makeIndvidualChatActive() {
    while(window.localStorage.getItem("current-active-user") == null)
    {}
    ChatroomComponent.currentActiveChatUser = window.localStorage.getItem("current-active-user");
    this.isIndvidualchatActive = true;
    var conversation = {
      ReceiverName: window.localStorage.getItem("current-active-user"),
      SenderName: window.localStorage.getItem("current-user")
    };
    this._chatService.getConversation(conversation).subscribe(
      (data:any) => {
        if(data.check) {
          this.isNewConversation = false;
          this.individualMessages = null;
          this.individualMessages = data.chatList;
          console.log(data.chatList);
         }
         else {
           this._chatService.getconversationR(conversation).subscribe(
            (data:any) => {
              if(data.check) {
                this.isNewConversation = false;
                this.individualMessages = null;
                this.individualMessages = data.chatList;
                console.log(data.chatList);
               }
               else {
                 this.isNewConversation = true;
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
    if(this.isIndvidualchatActive) {
      if(this.isFileSelected) {
      
      }
      else {
        var curDate = new Date();
        var chatMessage = {
            SenderName: window.localStorage.getItem("current-user"),
            ReceiverName: ChatroomComponent.currentActiveChatUser,
            chat: this.text, 
            chatImage: "", 
            currentDateTime: curDate.toISOString()
        }
        this.text = "";
        this._chatService.broadCastIndvidMsg(chatMessage).subscribe(
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
    else {
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

    this._chatService.onIndChatMsg()
    .subscribe((data:any) => {
      console.log(data);
      this.individualMessages.push(data);
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