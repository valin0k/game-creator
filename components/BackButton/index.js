import React from 'react'
import { observer, emit } from 'startupjs'
import { Div, Icon } from '@startupjs/ui'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default observer(function BackButton () {
  function toMainPage() {
    emit('url', '/')
  }

  return pug`
    Div.root(onPress=toMainPage)
      Icon(icon=faArrowLeft color='primary')
  `
})
