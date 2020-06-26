import React from 'react'
import { observer, useSession, $root, emit, useDoc, useQueryDoc, useValue } from 'startupjs'
import { Div, Button, Span, Card } from '@startupjs/ui'
import { STATUSES } from 'model/GamesModel'
import { Chat } from 'main/components'
import './index.styl'

export default observer(function ProfView ({ gameId }) {
  const [userId, $userId] = useSession('userId')
  const [game] = useDoc('games', gameId)
  const [player] = useQueryDoc('players', { userId, gameId })
  // const [group] = useQueryDoc('groups', { playerIds: { $elemMatch: {$in: [player.id]} } })

  const [group] = useQueryDoc('groups', { playerIds: { $all: [player.id] }} )
console.info("__group__", group)

  return pug`
    Div.root
      Div.content
        if game.status === STATUSES.opened
          Span.roleText Your role: #{player.role}
          Span.waitText Waiting for group formation
        else if game.status === STATUSES.grouped
          Span.waitText Waiting for start
      if group
        Div.chat
          Span.title Group chat 
          Chat(groupId=group.id playerId=player.id)
  `
})
