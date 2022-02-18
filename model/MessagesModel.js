import { BaseModel } from 'startupjs/orm'

export default class MessagesModel extends BaseModel {
  async addMessage(data = {}) {
    let id = this.id()
    await this.root.add(this, {
      ...data,
      createdAt: Date.now(),
      id
    })
    return id
  }
}
