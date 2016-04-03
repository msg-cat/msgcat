import BasicStore from './BasicStore';

export default class ChannelsStore extends BasicStore {
  constructor(world) {
    //super({}, 'channels-store'); // uncomment to persist state
    super({});
    this.world = world;
  }

  setConnection(connection) {
    this.connection = connection;
  }
}
