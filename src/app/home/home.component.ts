import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { ChatService } from '../chat.service';
import {MatDialog} from "@angular/material"
import { MessagedialogComponent } from '../messagedialog/messagedialog.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  
  model : any = {};
  constructor( private router: Router, private _chatService: ChatService, public dialog : MatDialog) { }


  ngOnInit() {
  }
    

  registerUser() {
    this._chatService.register(this.model).subscribe(
        data => {
          console.log(data)
          if(data) {

          }
          else {
            this.showError("User Alread exists. please pick another username");
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

}
