import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { observer } from 'startupjs'
import { Icon } from '@startupjs/ui'
import './index.styl'

export default observer(function ({ dataSource, columns, align, shadow, horizontal }) {

  return pug`
    Wrapper(horizontal=horizontal)
      View.header
        each column in columns
          - const style = {width: column.width, maxWidth: column.width, ...column.headerCellStyle}
          View.headerCell(key=column.key style=style)
            if (column.titleContent)
              =column.titleContent
            else
              if column.onHeaderPress
                View(key=column.key)
                  TouchableOpacity.columnTextIcon(
                    onPress= () => { }
                  )
                    Text= column.title
              else
                Text= column.title

      View.body
        each record in dataSource
          View.bodyRow(key=record.id || record._id)
            each column, i in columns
              - const style = {width: column.width, maxWidth: column.width, ...column.bodyCellStyle}
              View.bodyCell(key=(column.key || column.dataIndex) style=style)
                if typeof record[column.dataIndex] === 'string'
                  Text= record[column.dataIndex]
                else
                  =record[column.dataIndex]
  `
})

const Wrapper = ({horizontal, children}) => {
  const TableWrapper = horizontal ? ScrollView : View

  return pug`
    if horizontal
      ScrollView(horizontal)
        View.table
          =children
    else
      View.table
        =children
  `
}
