import { MessageType } from './message';

export interface UserState {
  type: MessageType,
  name: string,
  oldName?: string,
}
