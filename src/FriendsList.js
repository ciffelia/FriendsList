const TwitterApiProvider = require('./TwitterApiProvider')

class FriendsList {
  constructor (config) {
    const { followingListId, ...apiConfig } = config

    this.followingListId = followingListId
    this.apiProvider = new TwitterApiProvider(apiConfig)

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
    await this.syncList(this.followingListId, realFollowing)
  }

  async minutelyTask () {
    await this.syncFollowing()
  }
}

module.exports = FriendsList
