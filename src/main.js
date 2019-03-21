const FriendsList = require('./FriendsList')
const config = require('../config')

const apps = config.map(config => new FriendsList(config))

for (const app of apps) {
  app.start()
}
