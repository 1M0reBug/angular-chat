import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message, MessageType } from '../message';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  private messages: Array<Message>;
  private message: Message;

  constructor(private chatService: ChatService) {
    this.messages = [];
    this.message = {
      author: '...',
      type: MessageType.sent,
      time: new Date(),
      content: '',
    };
  }

  ngOnInit() {
    const nickObservable = this.chatService.connect();
    nickObservable.subscribe((name: string) => this.message.author = name);

    this.chatService.getMessage().subscribe((message: Message) => {
      this.messages.push(message);
    });

    interface UserState {
      type: MessageType,
      name: string,
    }

    this.chatService.getUsersState().subscribe((state: UserState) => {
      let content = '';
      if (state.type === MessageType.newUser) {
        content = `${state.name} just joined`;
      } else if (state.type === MessageType.disconnectedUser) {
        content = `${state.name} leaved the chat`;
      }

      const message: Message = {
        content,
        type: state.type,
        class: 'notification'
      };

      this.pushMessage(message);
    });
  }

  pushMessage(message) {
    if (message.content === '') {
      console.error('Cannot send empty message');
      return;
    }

    if (!message.class) {
      message.class = message.type === MessageType.received
                    ? 'received'
                    : 'sent';
    }
    message.time = new Date();
    const messageCopy : Message = Object.assign({}, message);
    this.messages.push(messageCopy);
    this.chatService.sendMessage(messageCopy);
    this.message.content = '';
  }


  ngOnDestroy() {
    this.chatService.disconnect();
  }
}
