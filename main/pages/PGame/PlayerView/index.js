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

  const currentRoundIndex = useMemo(() => {
    if(!group) return 0

    return Math.max(group.answers.length, player.answers.length)
  }, [stringifyAnswers])

  const currentQuestionIndex = useMemo(() => {
    if(!group) return 0

    const groupAnswersLength = group.answers[currentRoundIndex] ? group.answers[currentRoundIndex].length - 1 : 0
    const playerAnswersLength = player.answers[currentRoundIndex] ? player.answers[currentRoundIndex].length - 1 : 0
    return groupAnswersLength + playerAnswersLength
  }, [stringifyAnswers])

  const currentQuestion = useMemo(() => {
    if(!group || currentRoundIndex >= game.roundsCount) return null
    // if(currentRoundIndex >= game.roundsCount) return null

    // const groupAnswersLength = group.answers[currentRound] ? group.answers[currentRound].length - 1 : 0
    // const playerAnswersLength = player.answers[currentRound] ? player.answers[currentRound].length - 1 : 0

    // const questionIndex = currentQuestionIndex
    // console.info("__questionIndex__", questionIndex)
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

  console.info("__currentRoundIndex__", currentRoundIndex)
  console.info("__currentQuestionIndex__", currentQuestionIndex)
  console.info("__currentQuestion__", currentQuestion)
  console.info("________________________________", )

  function submitGroupAnswer() {
    if(!group.currentAnswer) return

    if(!group.approvedBy.includes(player.id)) {

      // submit answer
      if(group.approvedBy.length + 1 === group.playerIds.length) {
        if(currentQuestionIndex < game.questions.length) {
          $group.push('answers.' + currentRoundIndex, group.currentAnswer)
        } else {
          $group.push('answers', [group.currentAnswer])
        }

        $group.set('currentAnswer', '')
        $group.set('approvedBy', [])
      } else {
        $group.push('approvedBy', player.id)
      }
    }
  }

  function submitPersonalAnswer() {
    if(!player.currentAnswer) return

    if(currentQuestionIndex < game.questions.length) {
      $player.push('answers.' + currentRoundIndex, player.currentAnswer)
    } else {
      $player.push('answers', [player.currentAnswer])
    }
    $player.set('currentAnswer', '')
  }

console.info("__currentQuestion__", currentQuestion)
console.info("__group__", group)

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
            - const answered = group.approvedBy.includes(player.id)
            - const waitForApprove = group.approvedBy.length
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
