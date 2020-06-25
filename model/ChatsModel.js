import { BaseModel } from 'startupjs/orm'

export default class ChatsModel extends BaseModel {
  async addChat(data = {}) {
    let id = this.id()
    await this.root.add(this, {
      ...data,
      createdAt: Date.now(),
      id
    })
    return id
  }
}
