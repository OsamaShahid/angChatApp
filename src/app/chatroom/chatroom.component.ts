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
import {FormControl} from '@angular/forms';

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
  messages:Array<any>;
  individualMessages:Array<Individualchats>;
  conversations:Array<any>;
  participents:any[] = null;
  text:string = "";
  selectedFile:File = null;
  isIndvidualchatActive:boolean = false;
  public static currentActiveChatUser:string = null;
  isFileSelected:boolean = false;
  isNewConversation:boolean = false;
  imageSrc: string;
  myControl: FormControl = new FormControl();
  
  constructor(private router: Router, private _chatService: ChatService,public snackBar: MatSnackBar) { 
    
  }

  ngOnInit() {
    this.individualMessages = new Array<Individualchats>();
    this.messages = new Array<any>();
    this.conversations = new Array<any>();
    this.checkSession();
    this.initIoConnection();

    var user = {
      username: window.localStorage.getItem("current-user")
    };
    this._chatService.getMyConversations(user).subscribe(
      (data:any) => {
        if(data.check) {
          this.conversations = data.conversations;
          console.log(this.conversations);
        }
        else {
        }
      },
      error => {
        console.error(error);
        return Observable.throw(error);
      });
    
  }

  ngOnDestroy() {
  }

  checkInput(e:any) {
    
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
                 this.individualMessages = [];
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
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.imageSrc = <string>reader.result;

        reader.readAsDataURL(file);
    }
    }
    else {
      this.isFileSelected = false;
      this.imageSrc = '';
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
        var curDate = new Date();
        var msgform = $('#msg_form')[0];
        var formData = new FormData(msgform);
        formData.append('SenderName', window.localStorage.getItem("current-user"));
        formData.append('chat', this.text);
        formData.append('currentDateTime', curDate.toISOString());
        formData.append('ReceiverName' , ChatroomComponent.currentActiveChatUser)
        $.ajax({
          url: 'http://192.168.34.54:4747/chatroom/indvidimg/upload',
          method: 'post',
          enctype: 'multipart/form-data',
          data: formData,
          processData: false,
          contentType: false,
          success: function(response){
          },
          error: function(error) {
          }
        });
        this.text = '';
        this.imageSrc = '';
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
          },
          error: function(error) {
          }
        });
        this.text = '';
        this.imageSrc = '';
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
      if(data.senderName === ChatroomComponent.currentActiveChatUser)
      {
        var pair = {
          receiverName: window.localStorage.getItem("current-user"),
          senderName: data.senderName
        };
        this._chatService.reduceIndividualChatCount(pair).subscribe(
        (data:any) => {
          if(data.check) {
          }
          else {
          }
        },
        error => {
          console.error(error);
          return Observable.throw(error);
        });
      }
      var user = {
        username: window.localStorage.getItem("current-user")
      };
      this._chatService.getMyConversations(user)
      .subscribe(
        (data:any) => {
          if(data.check) {
            this.conversations = data.conversations;
            console.log(this.conversations);
          }
          else {
          }
        },
        error => {
          console.error(error);
          return Observable.throw(error);
        });
      this.isNewConversation = false;
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