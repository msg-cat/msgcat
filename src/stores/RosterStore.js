import Dispatcher from '../Dispatcher';
import util from '../util';

import BasicStore from './BasicStore';

// Class: RosterStore
//
// Manages the roster, presence and subscriptions.
//
// Roster management itself is implemented by strope.roster.js.
// This class makes that information available to a bound react component,
// and also keeps track of incoming presences and contact subscriptions.
//
// Additionally it implements actions for managing the roster, the user's
// own prsesence and incoming presence subscriptions.
//
export default class RosterStore extends BasicStore {
  constructor() {
    super({
      // list of items stored in the roster
      items: [],
      // map of bare JIDs to a presence object.
      presence: {},
      // incoming presence subscriptions
      subscriptions: [],
      // information on the connected user
      me: {
        jid: '',
        resource: '',
        presence: 'available'
      }
    }, 'roster-store');
  }

  // INTERNAL. called by ConnectionStore, once a connection is established.
  setConnection(connection) {
    this.connection = connection;
    this.connection.roster.get();
    this.connection.roster.registerCallback(this._rosterChanged.bind(this));
    this.connection.addHandler(this._onPresence.bind(this), undefined, 'presence');
    this.state.me.jid = util.bareJID(connection.jid);
    this.state.me.resource = util.resourceFromJID(connection.jid);
    this.setMyPresence(this.state.me.presence);
  }

  // Set (and publish) the user's own presence
  setMyPresence(show) {
    this.state.me.presence = show;
    if(show === 'available') {
      show = '';
    }
    let update = $pres().c('show').t(show).up().tree();
    this.connection.send(update);
    this._changed();
  }

  // Add the given contact to the roster. This sends a presence subscription.
  addContact(jid) {
    this.connection.roster.subscribe(jid);
  }

  // Accepts the incoming subscription for the given jid.
  // Also removes the pending subscription from the local list.
  acceptSubscription(jid) {
    this.connection.send($pres({ to: jid, type: 'subscribed' }));
    this.removeSubscription(jid);
  }

  // Rejects the incoming subscription for the given jid.
  // Also removes the pending subscription from the local list.
  rejectSubscription(jid) {
    this.connection.send($pres({ to: jid, type: 'unsubscribed' }));
    this.removeSubscription(jid);
  }

  // Removes a subscription from the local list, but does not
  // send any reply (accept / reject).
  // Note that the subscription may show up again once the user
  // reconnects.
  removeSubscription(jid) {
    this.state.subscriptions = this.state.subscriptions.filter(sub => sub.jid !== jid);
    this._changed();
  }

  _rosterChanged(items, ...rest) {
    this.state.items = items;
    this._changed();
  }

  _onPresence(presence) {
    try {
    let type = presence.getAttribute('type');
    let from = presence.getAttribute('from');
    if(type == 'subscribe') {
      this.state.subscriptions.push({
        from: util.bareJID(from)
      });
    } else {
      let pres = this.state.presence[util.bareJID(from)];
      if(!pres) {
        pres = {};
      }
      let showElement = presence.getElementsByTagName('show')[0];
      pres.show = showElement ? showElement.textContent || 'available' : 'unavailable';
      this.state.presence[util.bareJID(from)] = pres;
    }
      this._changed();
    } catch(e) {
      console.error(e);
    }
    return true;
  }
}
