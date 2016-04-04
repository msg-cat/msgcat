import BasicStore from './BasicStore';
import Dispatcher from '../Dispatcher';

export default class PrivateChatsStore extends BasicStore {
  constructor(world) {
    super({
      chats: {}
    });
    this.world = world;
    Dispatcher.register('switch-to', jid => {
      let chat = this.getChat(jid);
      if(!chat.loaded) {
        this._loadBacklog(jid);
      }
    });

    Dispatcher.register('update-draft', (jid, draft) => {
      this.getChat(jid).draft = draft;
      this._changed();
    });

    Dispatcher.register('send-draft', jid => {
      let chat = this.getChat(jid);
      if(chat.draft.length > 0) {
        this.connection.send($message().c('body').t(chat.draft).up().tree());
        chat.draft = '';
        this._changed();
      }
    });
  }

  setConnection(connection) {
    this.connection = connection;
    this.connection.addHandler(this._onMessage.bind(this), null, 'message');
  }

  getChat(jid) {
    if(!jid) {
      return null;
    }
    if(!this.state.chats[jid]) {
      let chat = { jid: jid, messages: [], draft: '' };
      this.state.chats[jid] = chat;
    }
    return this.state.chats[jid];
  }

  _onMessage(message) {
    let from = util.bareJID(message.getAttribute('from'));
    let chat = this.getChat(from);
    // TODO:
    //   - fetch body
    //   - get chat state

    //this._changed();
    return true;
  }

  _loadBacklog(jid) {
    // TODO: load backlog from message archives!
  }
}
