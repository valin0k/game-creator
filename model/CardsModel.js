import { BaseModel } from 'startupjs/orm'

export default class CardsModel extends BaseModel {
  async addCard(data = {}) {
    let id = this.id()
    await this.root.add(this, {
      ...data,
      createdAt: Date.now(),
      id
    })
    return id
  }
}
