import React from 'react'
import { observer, useSession, useValue, $root } from 'startupjs'
import { Div, Button, TextInput, Span } from '@startupjs/ui'
import { InputWrapper } from 'components'
import { numberValidation, notEmptyValidation } from 'clientHelpers/validations'
import Questions from './Questions'
import './index.styl'

export default observer(function PAddCard () {
  const [userId, $userId] = useSession('userId')

  const [showErrors, $showErrors] = useValue()
  const [data, $data] = useValue({
    name: '',
    description: '',
    roundsCount: '',
    roles: [],
    questions: []
  })
  const [errors, $errors] = useValue({})

  async function onSubmit() {
    $showErrors.set(true)

    return
    await $root.scope('users').addUser({name: trimmedName, id: userId })
  }
  //
  // function onChangeText(value, field) {
  //   console.info("__field__", field)
  //   console.info("__value__", value)
  //   $data.set(field, value)
  //
  //   console.info("__data__", data)
  // }

  return pug`
    Div.root
      Span.title Form for create a new card type
      Div.form
        InputWrapper(
          showError=showErrors && !notEmptyValidation(data.name)
          label='Card name'
          errorMessage='Card name can not be empty'
        )
          TextInput(
            value=data.name
            onChangeText=(text) => $data.set('name', text)
          )
        InputWrapper(
          showError=showErrors && !notEmptyValidation(data.description)
          label='Description'
          errorMessage='Card description can not be empty'
        )
          TextInput(
            value=data.description
            numberOfLines=4
            onChangeText=(text) => $data.set('description', text)
          )
        InputWrapper(
          showError=showErrors && !numberValidation(data.roundsCount)
          label='Description'
          errorMessage='Card description can not be empty'
        )
          TextInput(
            value=data.roundsCount
            onChangeText=(text) => $data.set('roundsCount', text)
            keyboardType='numeric'
          )
        Questions(showErrors=showErrors)
          
        Button.button(onPress=onSubmit color='primary' variant='flat') Create
  `
})
