import React, { useEffect } from 'react'
import {observer, useSession, $root, emit, useDoc, useQueryDoc} from 'startupjs'
import { Div, Button, Span, Card } from '@startupjs/ui'
import { BackButton } from 'components'
import ProfView from './ProfView'
import PlayerView from './PlayerView'
import './index.styl'

export default observer(function PGame ({ match: { params: { gameId } } }) {
  const [userId, $userId] = useSession('userId')
  const [game] = useDoc('games', gameId)
  const [prof] = useDoc('users', game.profId)
  const [player] = useQueryDoc('players', { userId, gameId })

  const isProf = userId === prof.id

  useEffect(() => {
    if(!player) {
      emit('url', '/')
    }
  }, [!!player])

  if(!game) return null

  return pug`
    Div.root
      Div.titleWrapper
        BackButton
        Span.title Game: #{game.name}
        
      Div.content
        if isProf
          ProfView(gameId=gameId)
        else
          PlayerView
  `
})
