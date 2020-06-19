import { BaseModel } from 'startupjs/orm'

export default class GamesModel extends BaseModel {
  async addGame(data = {}) {
    let id = this.id()
    await this.root.add(this, {
      ...data,
      createdAt: Date.now(),
      open: true,
      currentRound: 1,
      playerIds: [],
      id
    })
    return id
  }

  // async join({gameId, playerId}) {
  //   const $game = this.scope(`games.${gameId}`)
  //   await this.root.subscribe($game)
  //
  //   const professorId = $game.get('profId')
  //   const playerIds = $game.get('playerIds')
  //
  //   if(!playerIds.includes(playerId)) {
  //     $game.push('playerIds', playerId)
  //   }
  //
  //   return true
  // }


  async nextRound({ gameId }) {
    const $game = this.scope(`games.${gameId}`)
    await this.root.subscribe($game)
    const currentRound = $game.get('currentRound')
    $game.set('currentRound', currentRound + 1)
  }

  async finishGame({ gameId }) {
    const $game = this.scope(`games.${gameId}`)
    await this.root.subscribe($game)
    $game.set('open', false)

    return true
  }
}
