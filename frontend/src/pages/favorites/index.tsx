import { Box, Tabs } from '@radix-ui/themes'
import './index.modules.scss'
import TabEpisode from './components/tabEpisode'
import TabComment from './components/tabComment'

export const Favorites = () => {
  return (
    <div className="favorites-layout">
      <h3>收藏</h3>

      <div className="favorites-content">
        <Tabs.Root defaultValue="1">
          <Tabs.List>
            <Tabs.Trigger value="1">单集</Tabs.Trigger>
            <Tabs.Trigger value="2">评论</Tabs.Trigger>
          </Tabs.List>

          <Box pt="3">
            <Tabs.Content value="1">
              <TabEpisode />
            </Tabs.Content>

            <Tabs.Content value="2">
              <TabComment />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </div>
    </div>
  )
}
