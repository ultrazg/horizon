import React, { useEffect, useState } from 'react'
import Popular from './components/popular'
import Recommended from './components/recommended'
import EditorRecommended from './components/editorRecommended'
import PeopleLike from './components/peopleLike'
import { discovery, refreshEpisodeCommend } from '@/api/discover'
import { DISCOVERY_TYPE_ENUM } from '@/types/discovery'
import './index.modules.scss'
import { EpisodeType } from '@/types/episode'
import { PodcastType } from '@/types/podcast'
import { imageType } from '@/types/image'
import { useNavigate } from 'react-router-dom'

export type PopularType = {
  target?: TargetType[]
  recommendation?: string
}

export type TargetType = {
  episode: EpisodeType
  recommendation: string
}

export type RecommendedType = {
  target?: {
    podcast: PodcastType
  }[]
}

export type PeopleLikeType = { pick: pick }[]

type pick = {
  commentCount: number
  episode: EpisodeType
  id: string
  isLiked: boolean
  likeCount: number
  pickedAt: string
  story: {
    emotion: string
    iconUrl: string
    text: string
  }
  user: {
    avatar: {
      picture: imageType
    }
    nickname: string
  }
}

export const Home: React.FC = () => {
  const [popular, setPopular] = useState<{
    records: PopularType
    loading: boolean
  }>({
    records: {},
    loading: false,
  }) // 大家都在听
  const [editorRecommended, setEditorRecommended] = useState<{
    records: {}
    loading: boolean
  }>({
    records: {},
    loading: false,
  }) // 编辑精选
  const [recommended, setRecommended] = useState<{
    records: RecommendedType
    loading: boolean
  }>({
    records: {},
    loading: false,
  }) // 精选节目
  const [peopleLike, setPeopleLike] = useState<{
    records: PeopleLikeType
    loading: boolean
  }>({
    records: [],
    loading: false,
  }) // TA 们的喜欢

  const navigateTo = useNavigate()
  const goPodcastDetail = (pid: string) => {
    navigateTo('/podcast/detail', {
      state: {
        pid,
      },
    })
  }

  const onRefreshEpisodeCommend = () => {
    setPopular({
      ...popular,
      loading: true,
    })

    refreshEpisodeCommend()
      .then((res) => {
        setPopular({
          records: res.data.data,
          loading: false,
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * 获取「TA 们的喜欢」
   */
  const getPeopleLike = () => {
    setPeopleLike({
      records: [],
      loading: true,
    })

    discovery({ loadMoreKey: 'pick' })
      .then((res) => {
        res.data.data.forEach((item: any) => {
          if (item.type === DISCOVERY_TYPE_ENUM.PEOPLE_LIKE) {
            setPeopleLike({
              records: item.data,
              loading: false,
            })
          }
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * 获取「精选节目」
   */
  const getRecommended = () => {
    setRecommended({
      records: {},
      loading: true,
    })

    discovery({ loadMoreKey: 'discoveryTopic' })
      .then((res) => {
        res.data.data.forEach((item: any) => {
          if (item.type === DISCOVERY_TYPE_ENUM.RECOMMENDED) {
            item.data.forEach((i: any) => {
              if (i.displayType === 'PODCAST_DEFAULT') {
                setRecommended({
                  records: i,
                  loading: false,
                })
              }
            })
          }
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * 获取「大家都在听」和「编辑精选」
   */
  const getPopularAndRecommended = () => {
    setPopular({
      records: {},
      loading: true,
    })

    discovery({ loadMoreKey: '' })
      .then((res) => {
        res.data.data.forEach((item: any) => {
          if (item.type === DISCOVERY_TYPE_ENUM.POPULAR) {
            setPopular({
              records: item.data,
              loading: false,
            })
          }
          if (item.type === DISCOVERY_TYPE_ENUM.EDITOR_RECOMMENDED) {
            setEditorRecommended({
              records: item.data,
              loading: false,
            })
          }
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    getPopularAndRecommended()
    getRecommended()
    getPeopleLike()
  }, [])

  return (
    <div className="home-layout">
      <Popular
        data={popular.records}
        loading={popular.loading}
        onRefresh={() => {
          onRefreshEpisodeCommend()
        }}
        onDetail={(pid) => {
          goPodcastDetail(pid)
        }}
      />
      <Recommended
        data={recommended.records}
        loading={recommended.loading}
        onDetail={(pid) => {
          goPodcastDetail(pid)
        }}
      />
      <EditorRecommended
        data={editorRecommended.records}
        loading={editorRecommended.loading}
        onDetail={(pid) => {
          goPodcastDetail(pid)
        }}
      />
      <PeopleLike
        data={peopleLike.records}
        loading={peopleLike.loading}
        onDetail={(pid) => {
          goPodcastDetail(pid)
        }}
      />
    </div>
  )
}
