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
  const canFordGroups = game.playerIds.length >= game.roles.length && game.status === STATUSES.opened

  async function onFordGroups() {
    await $root.scope('games').changeStatus({ gameId, status: STATUSES.grouped })
    await removePlayersWithoutPair()
    await createGroupsWithChats()
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

    const groups = gamePlayers.reduce((acc, playerId) => {
      const lastIndex = acc.length > 1 ? acc.length - 1 : 0
      if((acc[lastIndex] && acc[lastIndex].length) >= rolesLength) {
        acc.push(playerId)
      } else {
        if(acc[lastIndex]) {
          acc[lastIndex].push(playerId)
        } else {
          acc[lastIndex] = [playerId]
        }
      }
      return acc
    }, [] )
    console.info("__groups__", groups)

    const groupPromises = groups.map(playerIds => $root.scope('groups').addGroup({ gameId, playerIds }))
    const groupIds = await Promise.all(groupPromises)
    console.info("__groupIds__", groupIds)
    const chatPromises = groups.map((playerIds, i) => $root.scope('chats').addChat({ playerIds, groupId: groupIds[i] }))
    await Promise.all(chatPromises)
    console.info("__chatPromises__", chatPromises)
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
