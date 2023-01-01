const FriendsList = require('./FriendsList')

if (process.env.FRIENDS_LIST_CONFIG === undefined) {
  throw new Error('FRIENDS_LIST_CONFIG is not set.')
}
const config = require(process.env.FRIENDS_LIST_CONFIG)

const apps = config.map(config => new FriendsList(config))

console.log(`Starting apps for ${apps.length} users.`)
for (const app of apps) {
  app.start()
}
