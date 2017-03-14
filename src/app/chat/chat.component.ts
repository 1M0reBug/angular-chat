import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message, MessageType } from '../message';
import { UserState } from '../user-state';
import { ChatService } from '../chat.service';
import { buildMessageStrategy } from '../message-strategy';

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

    this.chatService.getUsersState().subscribe((state: UserState) => {
      const data = buildMessageStrategy(this.userList, state);
      this.userList = data.userList;
      const message = data.message as Message;
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

  changedName(name) {
    console.log('changedName');
    this.chatService.setUsername(name);
    this.renameUserInList(this.message.author, name);
    this.message.author = name;
  }

  renameUserInList(oldName, newName) {
    const idx = this.userList.indexOf(oldName);
    this.userList[idx] = newName;
  }


  ngOnDestroy() {
    this.chatService.disconnect();
  }
}
