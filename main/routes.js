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
    path: '/about',
    exact: true,
    component: components.PAbout,
    filters: [isLoggedIn]
  }
]
