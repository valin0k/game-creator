import React from 'react'
import { observer } from 'startupjs'
import { Div, Span } from '@startupjs/ui'
import './index.styl'

export default observer(function InputWrapper ({
  label,
  children,
  errorMessage,
  showError
}) {

  return pug`
    Div.root
      if label
        Span.textLabel=label
      Div=children
      Div.error
        Span.errorText=showError && errorMessage
  `
})
