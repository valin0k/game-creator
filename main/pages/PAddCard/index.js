import React from 'react'
import { observer, useSession, useValue, $root } from 'startupjs'
import { Div, Button, TextInput, Span } from '@startupjs/ui'
import { InputWrapper } from 'components'
import { numberValidation, notEmptyValidation } from 'clientHelpers/validations'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import Question from './Question'
import './index.styl'

const NEW_QUESTION = {
  title: '',
  group: true,
  formula: ''
}

export default observer(function PAddCard () {
  const [userId, $userId] = useSession('userId')

  const [showErrors, $showErrors] = useValue()
  const [data, $data] = useValue({
    name: '',
    description: '',
    roundsCount: '',
    roles: [''],
    questions: [{...NEW_QUESTION}]
  })

  async function onSubmit() {
    $showErrors.set(true)

  }

  function onChangeQuestion(i, field, value) {
    $data.set('questions.' + i + '.' + field, value)
  }

  async function onAddQuestion() {
    $data.push('questions', {...NEW_QUESTION})
  }

  function onRemoveQuestion(i) {
    $data.del('questions.' + i)
  }

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

        Div.subform
          Div.titleWrapper
            Span.title Roles
            Button.button(onPress=() => $data.push('roles', '')) +
          Div.roles
            each role, i in data.roles
              InputWrapper(
                showError=showErrors && !notEmptyValidation(role)
                label='Player role'
                errorMessage='Player role can not be empty'
              )
                TextInput(
                  value=role
                  onChangeText=(text) => $data.set('roles.' + i, text)
                  onIconPress=() => data.roles.length > 1 && $data.del('roles.' + i)
                  iconPosition='right'
                  icon=faTimesCircle
                )
          
        Div.subform
          Div.titleWrapper
            Span.title Questions
            Button.button(onPress=onAddQuestion) +
          Div.questions
            each question, i in data.questions
              Question(
                key=i 
                onChange=(field, value) => onChangeQuestion(i, field, value) 
                showErrors=showErrors
                onRemove=() => onRemoveQuestion(i)
                canRemove=data.questions.length > 1
                ...question
              )

        Button.button(onPress=onSubmit color='primary' variant='flat') Create
  `
})
