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

    await this.twit.post('lists/members/create_all', {
      list_id: listId,
      user_id: userIds
    })
  }

  async removeUsersFromList (listId, userIds) {
    if (userIds.length === 0) return

    await this.twit.post('lists/members/destroy_all', {
      list_id: listId,
      user_id: userIds
    })
  }
}

module.exports = TwitterApiProvider
