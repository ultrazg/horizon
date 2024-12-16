import { createHashRouter } from 'react-router-dom'

import {
  Home,
  Login,
  Setting,
  Search,
  Subscription,
  Favorites,
  Profile,
  About,
  PodcastDetail,
  Launch,
} from '@/pages'
import { Root } from '@/layouts'

export const router = createHashRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'setting',
        element: <Setting />,
      },
      {
        path: 'search',
        element: <Search />,
      },
      {
        path: 'subscription',
        element: <Subscription />,
      },
      {
        path: 'favorites',
        element: <Favorites />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'podcast/detail',
        element: <PodcastDetail />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/launch',
    element: <Launch />,
  },
])
