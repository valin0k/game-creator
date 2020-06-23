import React from 'react'
import { observer, useSession, useValue, $root, emit, useQuery } from 'startupjs'
import { Div, Button, TextInput, Span, Card } from '@startupjs/ui'
import { InputWrapper, BackButton } from 'components'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

export default observer(function PAddGame () {
  const [userId, $userId] = useSession('userId')
  const [cards] = useQuery('cards', {name: {$exists: true}})
console.info("__cards__", cards)

  function onSubmit() {

  }

  return pug`
    Div.root
      Div.titleWrapper
        BackButton
        Span.title Choose a new game
      Div.cards
        each card in cards
          Card.card
            Span.cardTitle=card.name
            Span.cardDesc=card.description
            Span.cardRounds Rounds: #{card.roundsCount}
            Div.actions
              Button.createButton(onPress=onSubmit) Create
  `
})
