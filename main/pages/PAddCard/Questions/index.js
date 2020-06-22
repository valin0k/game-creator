import React from 'react'
import { observer, useSession, useValue, $root } from 'startupjs'
import { Div, Button, TextInput, Span } from '@startupjs/ui'
import { InputWrapper } from 'components'
import { numberValidation, notEmptyValidation } from 'clientHelpers/validations'
import Question from './Question'
import './index.styl'

export default observer(function Questions ({ showErrors }) {
  const [data, $data] = useValue([{}])

  async function onAddQuestion() {
    $data.push({
      title: '',
      group: true,
      formula: ''
    })
  }

  function onChangeField(i, field, value) {
    $data.set(i + '.' + field, value)
  }

  return pug`
    Div.root
      Div.titleWrapper
        Span.title Questions
        Button.button(onPress=onAddQuestion) +
      Div.form
        each question, i in data
          Question(
            key=i 
            onChange=(field, value) => onChangeField(i, field, value) 
            showErrors=showErrors
            ...question
          )

  `
})
