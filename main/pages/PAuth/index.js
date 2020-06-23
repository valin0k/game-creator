import React from 'react'
import { observer, useSession, useValue, $root, emit } from 'startupjs'
import { Div, Button, TextInput, Span } from '@startupjs/ui'
import './index.styl'

export default observer(function PAuth () {
  const [userId, $userId] = useSession('userId')
  const [nameValue, $nameValue] = useValue('')

  async function onSubmit() {
    const trimmedName = nameValue.trim()
    if(!trimmedName) return
    await $root.scope('users').addUser({name: trimmedName, id: userId })
    emit('url', '/')
  }

  function onChangeText(value) {
    $nameValue.set(value)
  }

  return pug`
    Div.root
      Span.title Auth form
      Div.form
        TextInput(placeholder='Type your name...' onChangeText=onChangeText value=nameValue)
        Button.button(onPress=onSubmit color='primary' variant='flat') Take me in
  `
})
