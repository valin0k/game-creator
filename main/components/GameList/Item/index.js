import React, { useMemo } from 'react'
import { observer, useSession, $root, useDoc, useQueryDoc, emit } from 'startupjs'
import { Button, Avatar, Div, Span, Card } from '@startupjs/ui'
import './index.styl'

export default observer(function GameListItem ({ gameId, first }) {
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
      const playerId = await $root.scope('players').addPlayer({ gameId, userId })
      await $root.scope('games').join({ gameId, playerId })
    }

    emit('url', `/games/${gameId}`)
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
        Button.createButton(onPress=joinGame)=inGame ? 'Open' : 'Join'
  `
})
