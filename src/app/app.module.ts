import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import {EmojiPickerModule} from 'ng-emoji-picker-material';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';


import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ChatService } from './chat.service';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { MessagedialogComponent } from './messagedialog/messagedialog.component';
import { MatDialogModule } from '@angular/material/dialog'
import {MatSnackBarModule} from '@angular/material';

const config: SocketIoConfig = { url: 'http://192.168.34.54:4747', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ChatroomComponent,
    MessagedialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    EmojiPickerModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot([
      { 
        path: '', 
        component: HomeComponent
      },
      {
        path: 'login', 
        component: LoginComponent
      },
      {
        path: 'chatroom',
        component: ChatroomComponent
      },
      // otherwise redirect to home
      { 
        path: '**', 
        redirectTo: '' 
      }
    ])
  ],
  entryComponents: [MessagedialogComponent],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
