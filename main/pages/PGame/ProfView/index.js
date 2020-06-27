import React from 'react'
import { observer, useSession, $root, emit, useDoc, useValue } from 'startupjs'
import { Div, Button, Span, Card } from '@startupjs/ui'
import { BackButton } from 'components'
import chunk from 'lodash/chunk'
import { GamePlayers } from 'main/components'
import { STATUSES } from 'model/GamesModel'
import './index.styl'

export default observer(function ProfView ({ gameId }) {
  const [userId, $userId] = useSession('userId')
  const [game] = useDoc('games', gameId)
  const [loading, $loading] = useValue()

  const canFordGroups = game.playerIds.length >= game.roles.length && game.status === STATUSES.opened

  async function onFordGroups() {
    $loading.set(true)
    await $root.scope('games').changeStatus({ gameId, status: STATUSES.grouped })
    await removePlayersWithoutPair()
    await createGroupsWithChats()
    $loading.set(false)
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

  async function createGroupsWithChats() {
    const rolesLength = game.roles.length
    const gamePlayers = game.playerIds.slice(0, game.playerIds.length - (game.playerIds.length % rolesLength))
    const groups = chunk(gamePlayers, rolesLength)

    const groupPromises = groups.map(playerIds => $root.scope('groups').addGroup({ gameId, playerIds }))
    const groupIds = await Promise.all(groupPromises)
    const chatPromises = groups.map((playerIds, i) => $root.scope('chats').addChat({ playerIds, groupId: groupIds[i] }))
    await Promise.all(chatPromises)
  }

  async function onStartGame() {
    await $root.scope('games').changeStatus({ gameId, status: STATUSES.started })
  }

  if(!game) return null

  return pug`
    Div.root
      GamePlayers(gameId=gameId)
      Div.actions
        if game.status === STATUSES.opened
          Button.buttonFord(
            color='primary' 
            variant='flat'
            disabled=!canFordGroups || loading
            onPress=onFordGroups
          ) Ford groups
        if game.status === STATUSES.grouped
          Button.buttonStart(
            color='primary' 
            variant='flat'
            disabled=loading
            onPress=onStartGame
          ) Play
  `
})
