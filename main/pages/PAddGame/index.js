import React from 'react'
import { observer, useSession, useValue, $root, emit, useQuery } from 'startupjs'
import { Div, Button, TextInput, Span } from '@startupjs/ui'
import { InputWrapper } from 'components'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

export default observer(function PAddGame () {
  const [userId, $userId] = useSession('userId')
  const [cards] = useQuery('cards', {name: {$exists: true}})
console.info("__cards__", cards)

  function onSubmit() {

  }

  return pug`
    Div.root
      Span.title Choose a new game
      Button.button(onPress=onSubmit color='primary' variant='flat') Create
  `
})
