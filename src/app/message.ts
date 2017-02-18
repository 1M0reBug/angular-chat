export enum MessageType {
  sent,
  received
}

export interface Message {
  type: MessageType,
  author: string,
  time: Date,
  content: string,
}
