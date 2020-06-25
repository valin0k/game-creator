import React from 'react'
import { observer, useSession, $root, emit, useDoc } from 'startupjs'
import { Div, Button, Span, Card } from '@startupjs/ui'
import { BackButton } from 'components'
import { GamePlayers } from 'main/components'
import { STATUSES } from 'model/GamesModel'
import './index.styl'

export default observer(function ProfView ({ gameId }) {
  const [userId, $userId] = useSession('userId')
  const [game] = useDoc('games', gameId)
  const canFordGroups = game.playerIds.length >= game.roles.length

  async function onFordGroups() {
    await $root.scope('games').changeStatus({ gameId, status: STATUSES.grouped })
    await removePlayersWithoutPair()
  }

  async function removePlayersWithoutPair() {
    const rolesLength = game.roles.length
    const playersWithoutPairs = game.playerIds.length % rolesLength

    if(playersWithoutPairs) {
      const ids = game.playerIds.slice(-playersWithoutPairs)

      const gamePromises = ids.map(id => $root.scope('games').kickPlayer({ gameId, playerId: id }))
      await Promise.all(gamePromises)

      const playerPromises = ids.map(id => $root.scope('players').removePlayer({ playerId: id }))
      await Promise.all(playerPromises)
    }
  }

  async function groupPlayers() {
    const rolesLength = game.roles.length
    const playersWithoutPairs = game.playerIds % rolesLength

    if(playersWithoutPairs) {
      const promises = playersWithoutPairs.map(id => $root.scope('games').kickPlayer({ gameId, userId: id }))
      await Promise.all(promises)
    }
  }

  if(!game) return null

  return pug`
    Div.root
      GamePlayers(gameId=gameId)
      Div.actions
        Button.buttonFord(
          color='primary' 
          variant='flat'
          disabled=!canFordGroups
          onPress=onFordGroups
        ) Ford groups
  `
})
