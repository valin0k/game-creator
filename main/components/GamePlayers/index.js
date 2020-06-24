import React from 'react'
import { observer, useSession, $root, emit, useDoc, useQueryIds } from 'startupjs'
import { Div, Button, Span, Card } from '@startupjs/ui'
import { BackButton, Table } from 'components'
// import './index.styl'

export default observer(function GamePlayers ({ gameId }) {
  const [userId, $userId] = useSession('userId')
  const [game] = useDoc('games', gameId)
  const [players] = useQueryIds('players', game.playerIds)

  console.info("__players__", players)

  if(!game) return null

  return pug`
    Div.root
      
  `
})
