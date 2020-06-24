import React, { useMemo, useState } from 'react'
import { observer, useSession, $root, useDoc, useQueryDoc, emit } from 'startupjs'
import { Button, Div, Span, Card } from '@startupjs/ui'
import './index.styl'

export default observer(function GameListItem ({ gameId }) {
  const [disableButton, setDisableButton] = useState()
  const [userId] = useSession('userId')
  const [game] = useDoc('games', gameId)
  const [isPlayer] = useQueryDoc('players', { gameId, userId })
  const [prof] = useDoc('users', game.profId)

  const inGame = useMemo(() => {
    const playerIds = game.playerIds || []
    return isPlayer || game.profId === userId
  }, [JSON.stringify(game.playerIds)])

  async function joinGame() {
    if(!inGame) {
      setDisableButton(true)

      const playerId = await $root.scope('players').addPlayer({ gameId, userId, role: getRole() })
      await $root.scope('games').join({ gameId, playerId })
    }

    emit('url', `/games/${gameId}`)
  }

  function getRole() {
    const roles = game.roles.length
    const players = game.playerIds.length

    let roleIndex = players > roles ? players % roles : players
    return game.roles[roleIndex]
  }

  const profName = userId === prof.id ? 'you' : prof && prof.name

  return pug`
    Card.root
      Div.content
        Span.gameTitle=game.name
        Span.gameDesc=game.description
        Span.gamePlayers Players: #{game.playerIds.length}
        Span.gameProf Prof: #{profName}
        Span.gameRounds Rounds: #{game.roundsCount}
        Span.gameQuestions Questions: #{game.questions.length}
      Div.actions
        Button.createButton(onPress=joinGame disabled=disableButton)=inGame ? 'Open' : 'Join'
  `
})
