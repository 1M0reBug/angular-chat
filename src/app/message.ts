export enum MessageType {
  sent,
  received,
  newUser,
  disconnectedUser
}

export interface Message {
  type: MessageType,
  author?: string,
  time?: Date,
  content: string,
  class?: string,
}
