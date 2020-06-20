import React from 'react'
import { observer, emit } from 'startupjs'
import { ScrollView } from 'react-native'
import './index.styl'
import { Content, Div, Button } from '@startupjs/ui'

export default observer(function PHome () {
  return pug`
    Div.root
      Button.button(color='primary' variant='flat' onPress=() => emit('url', '/addcard')) Add new card type
        
  `
})
