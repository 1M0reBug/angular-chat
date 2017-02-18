export enum MessageType {
  sent,
  received,
  newUser,
  disconnectedUser,
  renamedUser,
}

export interface Message {
  type: MessageType,
  author?: string,
  time?: Date,
  content: string,
  class?: string,
}
