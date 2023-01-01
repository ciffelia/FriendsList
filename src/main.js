const FriendsList = require('./FriendsList')
const config = require(process.env.FRIENDS_LIST_CONFIG || '../config')

const apps = config.map(config => new FriendsList(config))

for (const app of apps) {
  app.start()
}
