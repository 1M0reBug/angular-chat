import { UserState } from './user-state';
import { Message, MessageType } from './message';

interface StrategyReturn {
  content: string,
  userList: Array<string>,
};

abstract class AbstractMessageTypeStrategy {
  constructor(protected userList: Array<string>, protected state: UserState) { }

  abstract run(): StrategyReturn;
}

class NewUserStrategy extends AbstractMessageTypeStrategy {
  run(): StrategyReturn {
    const username = this.state.name;
    return {
      content: `${username} just joined`,
      userList: [...this.userList, username],
    };
  }
}

class DisconnectedUserStrategy extends AbstractMessageTypeStrategy {
  run(): StrategyReturn {
    const username = this.state.name;
    const userList = this.userList.filter(u => u !== username);
    return {
      content: `${username} leaved the chat`,
      userList,
    };
  }
}

class RenamedUserStrategy extends AbstractMessageTypeStrategy {
  run(): StrategyReturn {
    const oldName = this.state.oldName;
    const username = this.state.name;
    const userList = this.userList.map(e => e === oldName ? username : e);
    return {
      content: `${oldName} is now known as ${username}`,
      userList,
    };
  }
}

class EnumExtension {
  static values(e): Array<string | number> {
    return Object.keys(e).map(k => e[k]);
  }

  static names(e): Array<string> {
    return EnumExtension.values(e)
            .filter(v => typeof v === 'string') as Array<string>;
  }

  static int(e): Array<number> {
    return EnumExtension.values(e)
      .filter(v => typeof v === 'number') as Array<number>;
  }

  static obj<T extends number>(e) {
    return EnumExtension.names(e).map(n => ({ name: n, value: e[n] as T }));
  }

}

function strategyFactory(userList, state): AbstractMessageTypeStrategy {
  const { type } = state;

  EnumExtension.names(MessageType)
    .map(n => pascalCase(n)) // FIXME can't find pascalCase
                             // need to find how to import pascalCase!

  if (type === MessageType.disconnectedUser) {
    return new DisconnectedUserStrategy(userList, state);
  } else if (type === MessageType.newUser) {
    return new NewUserStrategy(userList, state);
  } else if (type === MessageType.renamedUser) {
    return new RenamedUserStrategy(userList, state);
  }

  throw new Error('no Strategy found!');
}

export function buildMessageStrategy(userList: Array<string>, state: UserState) {
  const strategy = strategyFactory(userList, state);
  const data = strategy.run();
  return {
    message: {
      content: data.content,
      type: state.type,
      class: 'notification',
    },
    userList: data.userList,
  };
}
