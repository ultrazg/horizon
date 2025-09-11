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
  Crash,
  EditorPickHistory,
} from '@/pages'
import { ResultUser } from '@/pages/search/resultUser'
import { ResultEpisode } from '@/pages/search/resultEpisode'
import { ResultPodcast } from '@/pages/search/resultPodcast'
import { Root } from '@/layouts'

export const router = createHashRouter([
  {
    path: '/',
    Component: Root,
    errorElement: <Crash />,
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
        path: 'search/user',
        element: <ResultUser />,
      },
      {
        path: 'search/episode',
        element: <ResultEpisode />,
      },
      {
        path: 'search/podcast',
        element: <ResultPodcast />,
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
      {
        path: 'editorPickHistory',
        element: <EditorPickHistory />,
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
