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
  private connection: any;

  constructor(private chatService: ChatService) {
    this.messages = [];
    this.message = {
      author: 'morebug',
      type: MessageType.sent,
      time: new Date(),
      content: '',
    };
  }

  ngOnInit() {
    this.connection = this.chatService.getMessage().subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

  pushMessage(message) {
    if (message.content === '') {
      console.error('Cannot send empty message');
      return;
    }
    message.time = new Date();
    const messageCopy : Message = Object.assign({}, message);
    this.messages.push(messageCopy);
    this.chatService.sendMessage(messageCopy);
    this.message.content = '';
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
