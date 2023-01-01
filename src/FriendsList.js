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
    this.log('Starting.')

    setInterval(this.minutelyTask, 1000 * 65)
    await this.minutelyTask()
  }

  async syncList (listId, users) {
    const listedUserIds = await this.apiProvider.fetchListMemberIds(listId)

    const userIdsToAddToList = users.filter(user => !listedUserIds.includes(user))
    const userIdsToRemoveFromList = listedUserIds.filter(user => !users.includes(user))

    if (userIdsToAddToList.length > 0) {
      this.log(`New friend(s) detected: ${userIdsToAddToList.join(', ')}`)
    }
    if (userIdsToRemoveFromList.length > 0) {
      this.log(`Deleted friend(s) detected: ${userIdsToRemoveFromList.join(', ')}`)
    }

    await Promise.all([
      this.apiProvider.addUsersToList(listId, userIdsToAddToList),
      this.apiProvider.removeUsersFromList(listId, userIdsToRemoveFromList)
    ])

    if (userIdsToAddToList > 0 || userIdsToRemoveFromList > 0) {
      this.log('Sync completed.')
    }
  }

  async syncFollowing () {
    const realFollowing = await this.apiProvider.fetchFollowingIds(this.userId)
    await this.syncList(this.followingListId, realFollowing)
  }

  async minutelyTask () {
    await this.syncFollowing()
  }

  log (...data) {
    const ctx = this.userId ?? 'unknown'
    console.log(`[${ctx}]`, ...data)
  }
}

module.exports = FriendsList
