import { isLoggedIn, isNotLoggedIn } from 'helpers/filters'

export default (components = {}) => [
  {
    path: '/',
    exact: true,
    component: components.PHome,
    filters: [isLoggedIn]
  },
  {
    path: '/auth',
    exact: true,
    component: components.PAuth,
    filters: [isNotLoggedIn]
  },
  {
    path: '/addcard',
    exact: true,
    component: components.PAddCard,
    filters: [isLoggedIn]
  },
  {
    path: '/addgame',
    exact: true,
    component: components.PAddGame,
    filters: [isLoggedIn]
  },
  {
    path: '/games/:id',
    exact: true,
    component: components.PGame,
    filters: [isLoggedIn]
  }
]
