import { BaseModel } from 'startupjs/orm'

export default class GroupsModel extends BaseModel {
  async addGroup(data = {}) {
    let id = this.id()
    await this.root.add(this, {
      ...data,
      answers: [],
      currentAnswer: '',
      approvedBy: [],
      createdAt: Date.now(),
      currentRound: 1,
      scores: [],
      id
    })
    return id
  }
}
