import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { Message, MessageType } from './message';

@Injectable()
export class ChatService {

  private url = 'http://localhost:3000';
  private socket;

  sendMessage(message) {
    this.socket.emit('add-message', message);
  }

  connect() {
    const observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('name', name => {
        observer.next(name);
        observer.complete();
      });
    });

    return observable;
  }

  getMessage() {
    const observable = new Observable(observer => {
      this.socket.on('message', data => {
        data.type = MessageType.received;
        observer.next(data as Message);
      });
    });

    return observable;
  }

  getUsersState() {
    const observable = new Observable(observer => {
      this.socket.on('new-user', username => {
        observer.next({ type: MessageType.newUser, name: username.name });
      });

      this.socket.on('disconnect-user', username => {
        observer.next({ type: MessageType.disconnectedUser, name: username.name });
      });

      this.socket.on('renamed-user', names => {
        observer.next({ type: MessageType.renamedUser, name: names.name, oldName: names.oldName })
      })
    });

    return observable;
  }

  setUsername(newName) {
    this.socket.emit('rename', newName);
  }

  disconnect() {
    this.socket.disconnect();
  }
}
