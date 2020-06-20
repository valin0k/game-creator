import React from 'react'
import { observer, useSession, useValue, $root } from 'startupjs'
import { Div, Button, TextInput, Span } from '@startupjs/ui'
import { numberValidation, notEmptyValidation } from 'clientHelpers/validations'
import './index.styl'

const FORM_DATA = [
  {
    label: 'name',
    validation: notEmptyValidation
  },
  {
    label: 'description',
    validation: notEmptyValidation
  },
  {
    label: 'roundsCount',
    props: { keyboardType: 'numeric'},
    validation: numberValidation
  },
]

export default observer(function PAddCard () {
  const [userId, $userId] = useSession('userId')
  const [nameValue, $nameValue] = useValue({
    name: '',
    description: '',
    roundsCount: 0,
    roles: [],
    questions: []
  })

  async function onSubmit() {
    const trimmedName = nameValue.trim()
    if(!trimmedName) return
    await $root.scope('users').addUser({name: trimmedName, id: userId })
  }

  function onChangeText(value) {
    $nameValue.set(value)
  }

  return pug`
    Div.root
      Span.title Add a new card type
      Div.form
        TextInput(placeholder='Type card name...' onChangeText=onChangeText value=nameValue)
        Button.button(onPress=onSubmit color='primary' variant='flat') Create
  `
})
