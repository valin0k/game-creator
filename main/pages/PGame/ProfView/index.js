import React from 'react'
import { observer, useSession, $root, emit, useDoc } from 'startupjs'
import { Div, Button, Span, Card } from '@startupjs/ui'
import { BackButton } from 'components'
import { GamePlayers } from 'main/components'
// import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

export default observer(function ProfView ({ gameId }) {
  const [userId, $userId] = useSession('userId')
  const [game] = useDoc('games', gameId)
  const canFordGroups = game.playerIds.length > game.roles.length

  async function onFordGroups() {
    await removePlayersWithoutPair()
  }

  async function removePlayersWithoutPair(ids) {
    const rolesLength = game.roles.length
    const playersWithoutPairs = game.playerIds.length % rolesLength

    if(playersWithoutPairs) {
      const ids = game.playerIds.splice(-playersWithoutPairs)

      return
      const promises = playersWithoutPairs.map(id => $root.scope('games').kickPlayer({ gameId, userId: id }))
      await Promise.all(promises)
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
