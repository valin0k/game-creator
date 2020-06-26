import React from 'react'
import {observer, useDoc, useSession} from 'startupjs'
import { Span, Avatar, Row, Div } from '@startupjs/ui'
import moment from 'moment'
import './index.styl'

export default observer(function Message ({
  messageId,
  timeFormat,
  style,
}) {
  const [userId] = useSession('userId')
  const [message] = useDoc('messages', messageId)
  const [user] = useDoc('users', message.userId)
  if (!message) return

  const time = timeFormat
    ? moment(message.createdAt).format(timeFormat)
    : moment(message.createdAt).calendar()

  const isMy = userId === message.userId
  switch (message.type) {
    case 'system':
      return pug`
        Row.root(style=style)
          Span.system(size='xs' description)= message.text
      `
    default:
      return pug`
        Row.root(style=style)
          if !isMy
            Avatar.avatar(size='s')=user.name
          Div.content(styleName={hideUser: !isMy})
            Row.infoRow(styleName={isMy})
              if !isMy
                Span.name(size='s' description)= user.name + ','
              Span.time(size='s' description)=time
            Row.messageRow(styleName={isMy} wrap)
              Span.message= message.text
      `
  }
})
