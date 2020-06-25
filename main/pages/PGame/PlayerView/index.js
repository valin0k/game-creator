import React from 'react'
import { observer, useSession, $root, emit, useDoc, useQueryDoc, useValue } from 'startupjs'
import { Div, Button, Span, Card } from '@startupjs/ui'
import { STATUSES } from 'model/GamesModel'
import './index.styl'

export default observer(function ProfView ({ gameId }) {
  const [userId, $userId] = useSession('userId')
  const [game] = useDoc('games', gameId)
  const [player] = useQueryDoc('players', { userId, gameId })


  return pug`
    Div.root

  `
})
