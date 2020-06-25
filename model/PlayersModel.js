import { BaseModel } from 'startupjs/orm'

export default class PlayersModel extends BaseModel {
  async addPlayer (data = {}) {
    const id = this.id()
    await this.root.add(this, {
      ...data,
      createdAt: Date.now(),
      answers: [],
      id
    })
    return id
  }

  async removePlayer ({ playerId }) {
    this.root.at(`players.${playerId}`).del()
  }
}
