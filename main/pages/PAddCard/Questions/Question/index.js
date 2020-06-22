import React from 'react'
import { observer } from 'startupjs'
import { Div, TextInput, Span, Checkbox } from '@startupjs/ui'
import { InputWrapper } from 'components'
import { notEmptyValidation } from 'clientHelpers/validations'
import './index.styl'

export default observer(function Question ({ onChange, title, group, formula, showErrors }) {
  console.info("__showErrors__", showErrors)
  return pug`
    Div.root
      InputWrapper(
        showError=showErrors && !notEmptyValidation(title)
        label='Title'
        errorMessage='Question title can not be empty'
      )
        TextInput(
          value=title
          onChangeText=(text) => onChange('title', text)
        )
      InputWrapper(
        showError=showErrors && !notEmptyValidation(formula)
        label='Formula'
        errorMessage='Formula for calculating scores can not be empty'
      )
        TextInput(
          value=formula
          onChangeText=(text) => onChange('formula', text)
        )
      Div.switch
        Span.label Is group question?
        Checkbox(onChange=() => onChange('group', !group) value=group)
        
  `
})
