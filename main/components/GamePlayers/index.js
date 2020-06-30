import React  from 'react'
import { observer, useDoc, useQueryIds } from 'startupjs'
import { Div, Span } from '@startupjs/ui'
import { Table } from 'components'
import './index.styl'

export default observer(function GamePlayers ({ gameId }) {
  const [game] = useDoc('games', gameId)
  const [players] = useQueryIds('players', game.playerIds)
  const [users] = useQueryIds('users', players.map(player => player.userId))

  const playersData = players.map(player => {
    const user = users.find(user => player.userId === user.id)
    return {
      role: player.role,
      name: user ? user.name : '-'
    }
  })

  const columns = [
    {
      title: 'Player name',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Role',
      key: 'role',
      dataIndex: 'role',
    }
  ]

  return pug`
    Div.root
      if players.length
        Span.title Players:
        Div.tableWrapper
          Table(columns=columns dataSource=playersData)
      else
        Div.noPlayers
          Span.title No players yet
  `
})
