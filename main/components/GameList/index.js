import React from 'react'
import { observer, useSession, useQuery } from 'startupjs'
import { Span, Div } from '@startupjs/ui'
import Item from './Item'
import './index.styl'

export default observer(function GameList () {
  const [userId] = useSession('userId')
  const [userPlayers] = useQuery('players', { userId })
  const playerIds = userPlayers.map(player => player.id)

  const [games, $games] = useQuery('games', {
    open: true,
    // $or: [
    //   // {
    //   //   $nor: [
    //   //     { playerIds: { $size: 2 } },
    //   //   ],
    //   // },
    //   { profId: userId },
    //   { playerIds: { $in: playerIds } }
    // ]
  })

  return pug`
    Div.root
      if games.length
        Span.title Games list
        Div.games
          each game, i in games
            Item(gameId=game.id key=game.id)
      else
        Div.splashScreen
          Span.title There is no games yet. Please, create a new one
  `
})
