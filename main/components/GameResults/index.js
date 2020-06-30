import React, { useMemo } from 'react'
import { observer, useSession, useDoc, useQuery, useQueryIds } from 'startupjs'
import { Div, Span } from '@startupjs/ui'
import { Table } from 'components'
import './index.styl'

export default observer(function GameResult ({ gameId }) {
  const [userId] = useSession('userId')
  const [game] = useDoc('games', gameId)
  console.info("__game__", game)
  const [players] = useQueryIds('players', game && game.playerIds)

  const userIds = useMemo(() => {
    return players.map(player => player.userId)
  }, [])

  const [users] = useQueryIds('users', userIds)
  const [groups] = useQuery('groups', { gameId })

  const allAnswers = [...players, ...groups].map(item => item.answers)
  const stringifyAnswers = JSON.stringify(allAnswers)

  const playerGroups = useMemo(() => {
    return groups.reduce((acc, group) => {
      acc.push({
        ...group,
        players: players
          .filter(player => group.playerIds.includes(player.id))
          .map(player => ({...player, name: users.find(user => user.id === player.userId).name}))
      })
      return acc
    }, [])
  }, [stringifyAnswers])

  const maxAnswersByGroup = useMemo(() => {
    const scoresByGroups = playerGroups.reduce((acc, group) => {
      const playersAnswers = group.players.map(player => player.answers.length)
      acc.push(group.answers.length + Math.max(...playersAnswers))
      return acc
    }, [])

    return Math.max(...scoresByGroups)
  }, [stringifyAnswers])

  const columns = useMemo(() => {
    const cols = [{
      title: 'name',
      key: 'name',
      dataIndex: 'name'
    }]

    Array(maxAnswersByGroup).fill(1).forEach((_, i) => {
      const round = i < game.questions.length ? 1 : Math.floor(i / game.questions.length) + 1
      if(i < game.questions.length) {
        cols.push(getColumnData(round, i, 'a'))
        cols.push(getColumnData(round, i, 's'))
      } else {
        const index = i % game.questions.length
        cols.push(getColumnData(round, index, 'a'))
        cols.push(getColumnData(round, index, 's'))
      }
    })
    return cols
  }, [stringifyAnswers])

  const data = useMemo(() => {
    const tableData = []

    playerGroups.forEach((group, groupIndex) => {
      tableData.push(getDataItem(group, true, groupIndex))

      group.players.forEach((player, playerIndex) => {
        console.info("__player__", player)
        tableData.push(getDataItem(player, false, playerIndex))
      })
    })

    return tableData
  }, [stringifyAnswers])

  function getDataItem(item, isGroup, index) {
    const dataItem = {}
    let questionIndex = 0

      return columns.reduce((acc, col, i) => {
        acc.name = isGroup ? 'Group ' + (index + 1) : item.name

        if(isGroup ? !getQuestionTypeByIndex(questionIndex) : getQuestionTypeByIndex(questionIndex)) {
          acc[col.dataIndex] = ''
          return acc
        }

        if(col.dataIndex.includes('a')) {
          acc[col.dataIndex] = item.answers[questionIndex]
        } else {
          acc[col.dataIndex] = item.scores[questionIndex]
          ++questionIndex
        }
        return acc
      }, {})
  }

console.info("__data__", data)
  function getQuestionTypeByIndex(i) {
    if(game.questions.length > i) return game.questions[i].group

    const index = i % game.questions.length
    return game.questions[index].group
  }

  function getColumnData(round, questionIndex, type) {
    return {
      title: `${type === 'a' ? 'Answers' : 'Scores'} for ${game.questions[questionIndex].title}. Round ${round}`,
      key: type + questionIndex + round,
      dataIndex: type + questionIndex + round
    }
  }

console.info("__columns__", columns)

  return pug`
    Div.root
      Table(columns=columns dataSource=data)
  `
})
