let client = null;

export default {
  connectTo(_client) {
    client = _client;
  },

  updateCredential(key, value) {
    client.update({ [`credentials.${key}`]: value });
  },

  commitCredentials() {
    client.connect();
  }
}
