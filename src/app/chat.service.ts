import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { User, Message } from './_Model/index'
import { Socket } from 'ng-socket-io';
import { Event } from './_Model/event';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ChatService {

  constructor(private http:HttpClient,private socket: Socket) { }

  register(user : User) {
    return this.http.post('http://192.168.34.54:4747/setUserName', user);
  }
  
  login(user: User) {
    return this.http.post('http://192.168.34.54:4747/chatroom/login', user);
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<Message> {
      return new Observable<Message>(observer => {
          this.socket.on('message', (data: Message) => observer.next(data));
      });
  }

  public onNewUserJoined(): Observable<any> {
    return new Observable<any>(observer =>{
      this.socket.on('NewUserJoined',(data:any)=>observer.next(data));
    });
  }
  public onEvent(event: Event): Observable<any> {
      return new Observable<Event>(observer => {
          this.socket.on(event, () => observer.next());
      });
  }

}