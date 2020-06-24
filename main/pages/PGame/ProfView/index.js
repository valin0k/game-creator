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

  console.info("__game__", game)

  if(!game) return null

  return pug`
    Div.root
      GamePlayers(gameId=gameId)
  `
})
