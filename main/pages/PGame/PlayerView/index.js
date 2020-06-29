import React, { useMemo } from 'react'
import { observer, useSession, $root, emit, useDoc, useQueryDoc, useValue } from 'startupjs'
import { Div, Button, Span, TextInput } from '@startupjs/ui'
import { STATUSES } from 'model/GamesModel'
import { Chat } from 'main/components'
import './index.styl'

export default observer(function ProfView ({ gameId }) {
  const [userId, $userId] = useSession('userId')
  const [game] = useDoc('games', gameId)
  const [player, $player] = useQueryDoc('players', { userId, gameId })
  // const [group] = useQueryDoc('groups', { playerIds: { $elemMatch: {$in: [player.id]} } })
  const [group, $group] = useQueryDoc('groups', { playerIds: { $all: [player && player.id] }} )
  const stringifyAnswers = JSON.stringify([player.answers, group && group.answers])

  const answersLength = useMemo(() => {
    if(!group) return 0

    const groupAnswersLength = group.answers.length ? group.answers.length : 0
    const playerAnswersLength = player.answers.length ? player.answers.length : 0
    return groupAnswersLength + playerAnswersLength
  }, [stringifyAnswers])

  const currentRoundIndex = useMemo(() => {
    if(!group) return 0

    const questionsThisRound = answersLength % game.questions.length
    const roundIndex = Math.floor(answersLength / game.questions.length)
    return questionsThisRound < game.questions.length ? roundIndex : roundIndex + 1

  }, [stringifyAnswers])

  const currentQuestionIndex = useMemo(() => {
    if(!group) return null

    const answersInPrevRounds = currentRoundIndex * game.questions.length

    return answersLength - answersInPrevRounds
  }, [stringifyAnswers])

  const currentQuestion = useMemo(() => {
    if(!group) return null

    if(currentRoundIndex === Number(game.roundsCount)) return null

    return game.questions[currentQuestionIndex]
  }, [stringifyAnswers])

  function onChangeAnswer(value) {
    if(currentQuestion.group) {
      !group.approvedBy.length && $group.set('currentAnswer', value)
    } else {
      $player.set('currentAnswer', value)
    }
  }

  function cancelAnswer() {
    if(currentQuestion.group) {
      $group.set('currentAnswer', '')
      $group.set('approvedBy', [])
    }
  }

  function submitGroupAnswer() {
    if(!group.currentAnswer || group.approvedBy.includes(player.id)) return

    if(group.approvedBy.length + 1 === group.playerIds.length) {
      $group.push('answers', group.currentAnswer)

      $group.set('currentAnswer', '')
      $group.set('approvedBy', [])
    } else {
      $group.push('approvedBy', player.id)
    }
  }

  function submitPersonalAnswer() {
    if(!player.currentAnswer) return

    $player.push('answers', player.currentAnswer)
    $player.set('currentAnswer', '')
  }

  return pug`
    Div.root
      Div.content
        if game.status === STATUSES.opened
          Span.roleText Your role: #{player.role}
          Span.waitText Waiting for group formation
        else if game.status === STATUSES.grouped
          Span.waitText Waiting for start
        else if game.status === STATUSES.started
          
          if currentQuestion
            - const isGroup = currentQuestion.group
            - const answered = isGroup && group.approvedBy.includes(player.id)
            - const waitForApprove = isGroup && group.approvedBy.length
            Div.questionWrapper
              Span.questionTypeText #{isGroup ? 'Group' : 'Single'} question
              Span.questionText=currentQuestion.title
              Div.answerField
                TextInput(
                  disabled=waitForApprove
                  value=isGroup ? group.currentAnswer : player.currentAnswer
                  onChangeText=onChangeAnswer
                )
                Div.actions
                  Button.cancelButton(disabled=!isGroup onPress=cancelAnswer) Cancel
                  Button.nextButton(
                    color='primary' 
                    variant='flat' 
                    onPress=isGroup ? submitGroupAnswer : submitPersonalAnswer
                    disabled=answered
                  ) Next
          else
            Div.noQuestionsWrapper
              Span Here is no questions left
          
      if group
        Div.chat
          Span.title Group chat
          Chat(groupId=group.id playerId=player.id)
  `
})
