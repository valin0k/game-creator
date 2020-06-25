import { BaseModel } from 'startupjs/orm'

export const STATUSES = {
  opened: 'OPENED',
  closed: 'CLOSED',
  grouped: 'GROUPED',
  started: 'STARTED'
}

export default class GamesModel extends BaseModel {
  async addGame(data = {}) {
    let id = this.id()
    await this.root.add(this, {
      ...data,
      createdAt: Date.now(),
      status: STATUSES.opened,
      currentRound: 1,
      playerIds: [],
      id
    })
    return id
  }

  async join({ gameId, playerId }) {
    const $game = this.scope(`games.${gameId}`)
    await this.root.subscribe($game)

    const playerIds = $game.get('playerIds')

    if(!playerIds.includes(playerId)) {
      $game.push('playerIds', playerId)
    }

    return true
  }

  async kickPlayer({ gameId, playerId }) {
    const $game = this.scope(`games.${gameId}`)
    await this.root.subscribe($game)

    const playerIds = [...$game.get('playerIds')]
    const index = playerIds.findIndex(id => id === playerId)
    if(index === -1) return

    playerIds.splice(index, 1)
    $game.set('playerIds', playerIds)
  }

  async changeStatus({ gameId, status }) {
    const $game = this.scope(`games.${gameId}`)
    await this.root.subscribe($game)

    $game.set('status', status)

    return true
  }
}
