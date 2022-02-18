import React, { useState } from 'react'
import { observer, useSession, $root, emit, useQuery } from 'startupjs'
import { Div, Button, Span, Card, Icon } from '@startupjs/ui'
import { BackButton } from 'components'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

export default observer(function PAddGame () {
  const [disableButton, setDisableButton] = useState()
  const [userId, $userId] = useSession('userId')
  const [cards, $cards] = useQuery('cards', {name: {$exists: true}})

  async function onSubmit({ name, description, roundsCount, roles, questions, id }) {
    setDisableButton(true)
    const gameData = { name, description, roundsCount, roles, questions, cardId: id }
    const gameId = await $root.scope('games').addGame({ profId: userId, ...gameData })
    emit('url', '/games/' + gameId)
  }

  return pug`
    Div.root
      Div.titleWrapper
        BackButton
        Span.title Choose a new game
      if cards.length
        Div.cards
          each card in cards
            - const canDelete = card.userId === userId
            Card.card(key=card.id)
              if canDelete
                Div.deleteCard(
                  onPress=() => $cards.del(card.id)
                )
                  Icon(icon=faTimes color='#de8484')
              Span.cardTitle(styleName={canDelete})=card.name
              Span.cardDesc=card.description
              Span.cardRounds Rounds: #{card.roundsCount}
              Span.cardQuestions Questions: #{card.questions.length}
              Div.actions
                Button.createButton(onPress=() => onSubmit(card) disabled=disableButton) Create
      else
        Div.splashScreen
          Span.title There is no cards yet
  `
})
