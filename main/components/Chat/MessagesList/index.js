import React, {useRef, useLayoutEffect} from 'react'
import { ScrollView } from 'react-native'
import {
  observer,
  useBatchQuery,
  useBatch,
  useQueryDoc,
} from 'startupjs'
import { Div, Span } from '@startupjs/ui'
import Message from '../Message'
import './index.styl'

const LIMIT = 100

export default observer(function MessagesList ({
  groupId,
  playerId,
  style,
  // children,
  messageTimeFormat,
}) {
  let scrollViewRef = useRef()
  const [chat] = useQueryDoc('chats', { groupId })
  const [messages] = useBatchQuery('messages', {
    chatId: chat.id,
    $sort: {createdAt: -1},
    $limit: LIMIT,
  })

  useBatch()
  useLayoutEffect(() => {
    setTimeout(() => {
      if (scrollViewRef.current) scrollViewRef.current.scrollToEnd()
    }, 100)
  })

  return pug`
    ScrollView(
      ref=scrollViewRef
      showsVerticalScrollIndicator=false
      contentContainerStyle={flexGrow: 1, flexShrink: 1}
    )
      Div.wrapper
        if messages.length
          each message in messages
            Message(
              key=message.id
              messageId=message.id
            )
        else
          Div.noMessages
            Span.noMessagesText Here is no messages yet...
  `
})
