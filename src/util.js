export default {
  bareJID(jid) {
    return jid.split('/')[0];
  },

  resourceFromJID(jid) {
    return jid.split('/')[1] || 'n/a';
  }
}
