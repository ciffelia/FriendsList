const TwitterApiProvider = require('./TwitterApiProvider')

class FriendsList {
  constructor () {
    this.apiProvider = new TwitterApiProvider({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    })

    this.minutelyTask = this.minutelyTask.bind(this)
  }

  async start () {
    this.userId = await this.apiProvider.fetchMyUserId()
    setInterval(this.minutelyTask, 1000 * 60)
    await this.minutelyTask()
  }

  async syncList (listId, users) {
    const listedUserIds = await this.apiProvider.fetchListMemberIds(listId)

    const userIdsToAddToList = users.filter(user => !listedUserIds.includes(user))
    const userIdsToRemoveFromList = listedUserIds.filter(user => !users.includes(user))

    await Promise.all([
      this.apiProvider.addUsersToList(listId, userIdsToAddToList),
      this.apiProvider.removeUsersFromList(listId, userIdsToRemoveFromList)
    ])
  }

  async syncFollowing () {
    const realFollowing = await this.apiProvider.fetchFollowingIds(this.userId)
    await this.syncList(process.env.TWITTER_FOLLOWING_LIST_ID, realFollowing)
  }

  async syncFollowers () {
    const realFollowers = await this.apiProvider.fetchFollowerIds(this.userId)
    await this.syncList(process.env.TWITTER_FOLLOWER_LIST_ID, realFollowers)
  }

  async minutelyTask () {
    // await Promise.all([
    //   this.syncFollowing(),
    //   this.syncFollowers()
    // ])
    await this.syncFollowing()
  }
}

module.exports = FriendsList
