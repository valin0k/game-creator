import React from 'react'
import { observer, useValue, useQueryDoc, $root, useSession } from 'startupjs'
import { Row, Button, TextInput } from '@startupjs/ui'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

export default observer(function SendMessage ({ groupId, playerId }) {
  const [userId] = useSession('userId')
  let [text = '', $text] = useValue()
  let [chat] = useQueryDoc('chats', { groupId })

  async function sendMessage () {
    let _text = $text.get() || ''
    _text = text.trim()
    if (!_text) return
    $text.del()
    await $root.scope('messages').addMessage({ chatId: chat.id, playerId, text: _text, userId })
  }

  return pug`
    Row.root(vAlign='center')
      TextInput.input(
        value=text
        blurOnSubmit=false
        onChangeText=text => $text.set(text)
        onSubmitEditing=sendMessage
        placeholder='Type a message here'
        returnKeyType='send'
        disabled=!chat
      )
      Button.submitButton(
        icon=faPaperPlane
        onPress=sendMessage
        variant='flat'
        color='primary'
        disabled=!chat
      )
  `
})
