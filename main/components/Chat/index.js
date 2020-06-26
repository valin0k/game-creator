import React from 'react'
import { observer, useQueryDoc } from 'startupjs'
import { Br, Div } from '@startupjs/ui'
import MessagesList from './MessagesList'
import SendMessage from './SendMessage'
import './index.styl'

export default observer(function Chat ({ groupId, playerId, messageTimeFormat = 'hh:mm' }) {
  return pug`
    Div.root
      MessagesList.full(groupId=groupId  playerId=playerId messageTimeFormat=messageTimeFormat)
      Br(half)
      SendMessage(groupId=groupId  playerId=playerId)
  `
})
