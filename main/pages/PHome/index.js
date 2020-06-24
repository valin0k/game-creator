import React from 'react'
import { observer, emit } from 'startupjs'
import { ScrollView } from 'react-native'
import { Content, Div, Button } from '@startupjs/ui'
import { GameList } from 'main/components'
import './index.styl'

export default observer(function PHome () {
  return pug`
    Div.root
      Div.actions
        Button.button(onPress=() => emit('url', '/addcard')) Add a new card type
        Button.buttonGame(onPress=() => emit('url', '/addgame')) Add a new game
      Div.gameList
        GameList
        
  `
})
