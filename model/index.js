import UsersModel from './UsersModel'
import CardsModel from './CardsModel'
import ChatsModel from './ChatsModel'
import GamesModel from './GamesModel'
import GroupsModel from './GroupsModel'
import MessagesModel from './MessagesModel'
import PlayersModel from './PlayersModel'

export default function (racer) {
  racer.orm('users', UsersModel)
  racer.orm('cards', CardsModel)
  racer.orm('chats', ChatsModel)
  racer.orm('games', GamesModel)
  racer.orm('groups', GroupsModel)
  racer.orm('messages', MessagesModel)
  racer.orm('players', PlayersModel)
}
