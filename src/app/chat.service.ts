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

  getMessage() {
    const observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', data => {
        data.type = MessageType.received;
        console.log('data');
        observer.next(data as Message);
      });

      return () => this.socket.disconnect()
    });

    return observable;
  }
}
