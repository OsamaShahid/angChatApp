import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { User, Message } from './_Model/index'
import { Socket } from 'ng-socket-io';
import { Eevent } from './_Model/eevent';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ChatService {

  constructor(private http:HttpClient,private socket: Socket) { }

  public register(user : User) {
    return this.http.post('http://192.168.34.54:4747/setUserName', user);
  }
  
  public login(user: User) {
    return this.http.post('http://192.168.34.54:4747/chatroom/login', user);
  }

  public broadCastMsg(newMsg:any)
  {
    return this.http.post('http://192.168.34.54:4747/chatroom/putChats', newMsg);
  }

  public validateSession(user: User) {
    return this.http.post('http://192.168.34.54:4747/chatroom/validateSession', user);
  }

  public getMessagesAndParticepents() {
    return this.http.post('http://192.168.34.54:4747/chatroom//get/chats',null);
  }

  public getParticepents() {
    return this.http.post('http://192.168.34.54:4747/chatroom/get/particepents', null);
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

  public onBroadCastMsg(): Observable<any> {
    return new Observable<any>(observer =>{
      this.socket.on('onBroadCastMsg',(data:any)=>observer.next(data));
    });
  }

  public onEvent(event: Eevent): Observable<any> {
      return new Observable<Event>(observer => {
          this.socket.on(event, () => observer.next());
      });
  }

}