import React from 'react'
import { observer } from 'startupjs'
import { Text, ScrollView } from 'react-native'
import './index.styl'
import { Content } from '@startupjs/ui'

export default observer(function PGame () {
  return pug`
    ScrollView.root
      Content
        Text.text Built on StartupJS
  `
})
