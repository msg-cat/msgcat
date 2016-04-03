import BasicStore from './BasicStore';

export default class PrivateChatsStore extends BasicStore {
  constructor(world) {
    //super({}, 'private-chats'); // uncomment to persist state
    super({});
    this.world = world;
  }

  setConnection(connection) {
    this.connection = connection;
  }
}
