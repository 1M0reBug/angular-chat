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
  private userList: Array<string>;

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
    nickObservable.subscribe((data: any) => {
      this.message.author = data.name;
      this.userList = data.userList;
    });

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
        this.userList.push(state.name);
        content = `${state.name} just joined`;
      } else if (state.type === MessageType.disconnectedUser) {
        this.userList = this.userList.filter(u => u !== state.name);
        content = `${state.name} leaved the chat`;
      }

      const message: Message = {
        content,
        type: state.type,
        class: 'notification'
      };

      this.displayMessage(message);
    });
  }

  pushMessage(message) {
    try {
      const prepMessage = this.displayMessage(message);
      this.chatService.sendMessage(prepMessage);
    } catch(e) {
      console.error(e.message);
    }
  }

  displayMessage(message) {
    if (message.content === '') {
      throw new Error('Cannot send empty message');
    }

    if (!message.class) {
      message.class = message.type === MessageType.received
        ? 'received'
        : 'sent';
    }
    message.time = new Date();
    const messageCopy : Message = Object.assign({}, message);
    this.messages.push(messageCopy);
    this.message.content = '';

    return messageCopy;
  }


  ngOnDestroy() {
    this.chatService.disconnect();
  }
}
