const Twit = require('twit')

class TwitterApiProvider {
  constructor (options) {
    this.twit = new Twit(options)
  }

  async fetchMyUserId () {
    const apiResult = await this.twit.get('account/verify_credentials')
    return apiResult.data.id_str
  }

  async fetchFollowingIds (userId) {
    const apiResult = await this.twit.get('friends/ids', {
      user_id: userId,
      stringify_ids: true,
      count: 5000
    })
    return apiResult.data.ids
  }

  async fetchListMemberIds (listId) {
    const apiResult = await this.twit.get('lists/members', {
      list_id: listId,
      count: 5000,
      include_entities: false,
      skip_status: true
    })
    return apiResult.data.users.map(user => user.id_str)
  }

  async addUsersToList (listId, userIds) {
    if (userIds.length === 0) return

    for (let i = 0; i < userIds.length; i += 100) {
      await this.twit.post('lists/members/create_all', {
        list_id: listId,
        user_id: userIds.slice(i, i + 100)
      })
    }
  }

  async removeUsersFromList (listId, userIds) {
    if (userIds.length === 0) return

    for (let i = 0; i < userIds.length; i += 100) {
      await this.twit.post('lists/members/destroy_all', {
        list_id: listId,
        user_id: userIds.slice(i, i + 100)
      })
    }
  }
}

module.exports = TwitterApiProvider
