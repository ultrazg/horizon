import { ColorfulShadow, NavBackButton } from '@/components'
import { useLocation } from 'react-router-dom'
import { AspectRatio, Box, Button, Heading, Text } from '@radix-ui/themes'
import { CheckIcon } from '@radix-ui/react-icons'
import { SlBubble, SlEarphones } from 'react-icons/sl'
import './index.modules.scss'

export const PodcastDetail = () => {
  const { id } = useLocation().state

  return (
    <div className="podcast-detail-layout">
      <NavBackButton />

      <div className="podcast-detail-info">
        <div className="pdi-top">
          <Box className="pdi-top-cover">
            <img
              src="https://images.unsplash.com/photo-1479030160180-b1860951d696?&auto=format&fit=crop&w=1200&q=80"
              alt="A house in a forest"
              style={{
                objectFit: 'cover',
                width: '20rem',
                height: '20rem',
                borderRadius: 'var(--radius-6)',
              }}
            />
          </Box>

          <div className="pdi-top-description">
            <div>
              <Heading
                size="9"
                align="left"
              >
                忽左忽右
              </Heading>
              <Text
                align="left"
                as="div"
                mt="4"
                mb="4"
                size="5"
                style={{ fontWeight: '300' }}
              >
                “忽左忽右”是一档文化沙龙类播客节目，试图为中文播客听众提供基于经验视角的话题和内容。本节目由JustPod出品
              </Text>
              <div className="sub">
                <Text
                  size="5"
                  mr="5"
                  style={{ fontWeight: '300' }}
                >
                  758554订阅
                </Text>
                <Button variant="soft">
                  <CheckIcon />
                  已订阅
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="podcast-detail">
          <Box
            mt="6"
            width="100%"
            height="100%"
          >
            <div className="podcasters">
              <div className="label">节目主播</div>

              <div className="layout">
                <div className="podcaster">
                  <div className="top">
                    <AspectRatio ratio={1}>
                      <img
                        src="https://images.unsplash.com/photo-1479030160180-b1860951d696?&auto=format&fit=crop&w=1200&q=80"
                        alt="A house in a forest"
                      />
                    </AspectRatio>
                  </div>
                  <div className="bottom">JustPod</div>
                </div>
              </div>
            </div>

            <div className="episode-lists">
              <div className="episode-item">
                <div className="left">
                  <ColorfulShadow
                    className="episode-cover"
                    curPointer
                    mask
                    src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                  />
                </div>
                <div className="right">
                  <p>小米SU7营销复盘：你所知道的为什么都是错的-Vol 46</p>
                  <p>
                    本期节目关注风口上的小米汽车，主播借助在营销、产品上的经验解答。欢迎在评论区留言发表你对小米汽车的感受与看法，对于节目话题的更多观点，获取更多未呈现在节目中的扩展阅读，欢迎加群讨论
                  </p>
                  <p>
                    <span>30分钟 · 03/29</span>
                    <span>
                      <SlEarphones />
                      4.3万+
                      <SlBubble />
                      349
                    </span>
                  </p>
                </div>
              </div>
              <div className="episode-item">
                <div className="left">
                  <ColorfulShadow
                    className="episode-cover"
                    curPointer
                    mask
                    src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                  />
                </div>
                <div className="right">
                  <p>小米SU7营销复盘：你所知道的为什么都是错的-Vol 46</p>
                  <p>
                    本期节目关注风口上的小米汽车，主播借助在营销、产品上的经验解答。欢迎在评论区留言发表你对小米汽车的感受与看法，对于节目话题的更多观点，获取更多未呈现在节目中的扩展阅读，欢迎加群讨论
                  </p>
                  <p>
                    <span>30分钟 · 03/29</span>
                    <span>
                      <SlEarphones />
                      4.3万+
                      <SlBubble />
                      349
                    </span>
                  </p>
                </div>
              </div>
              <div className="episode-item">
                <div className="left">
                  <ColorfulShadow
                    className="episode-cover"
                    curPointer
                    mask
                    src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                  />
                </div>
                <div className="right">
                  <p>小米SU7营销复盘：你所知道的为什么都是错的-Vol 46</p>
                  <p>
                    本期节目关注风口上的小米汽车，主播借助在营销、产品上的经验解答。欢迎在评论区留言发表你对小米汽车的感受与看法，对于节目话题的更多观点，获取更多未呈现在节目中的扩展阅读，欢迎加群讨论
                  </p>
                  <p>
                    <span>30分钟 · 03/29</span>
                    <span>
                      <SlEarphones />
                      4.3万+
                      <SlBubble />
                      349
                    </span>
                  </p>
                </div>
              </div>
              <div className="episode-item">
                <div className="left">
                  <ColorfulShadow
                    className="episode-cover"
                    curPointer
                    mask
                    src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                  />
                </div>
                <div className="right">
                  <p>小米SU7营销复盘：你所知道的为什么都是错的-Vol 46</p>
                  <p>
                    本期节目关注风口上的小米汽车，主播借助在营销、产品上的经验解答。欢迎在评论区留言发表你对小米汽车的感受与看法，对于节目话题的更多观点，获取更多未呈现在节目中的扩展阅读，欢迎加群讨论
                  </p>
                  <p>
                    <span>30分钟 · 03/29</span>
                    <span>
                      <SlEarphones />
                      4.3万+
                      <SlBubble />
                      349
                    </span>
                  </p>
                </div>
              </div>
              <div className="episode-item">
                <div className="left">
                  <ColorfulShadow
                    className="episode-cover"
                    curPointer
                    mask
                    src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                  />
                </div>
                <div className="right">
                  <p>小米SU7营销复盘：你所知道的为什么都是错的-Vol 46</p>
                  <p>
                    本期节目关注风口上的小米汽车，主播借助在营销、产品上的经验解答。欢迎在评论区留言发表你对小米汽车的感受与看法，对于节目话题的更多观点，获取更多未呈现在节目中的扩展阅读，欢迎加群讨论
                  </p>
                  <p>
                    <span>30分钟 · 03/29</span>
                    <span>
                      <SlEarphones />
                      4.3万+
                      <SlBubble />
                      349
                    </span>
                  </p>
                </div>
              </div>
              <div className="episode-item">
                <div className="left">
                  <ColorfulShadow
                    className="episode-cover"
                    curPointer
                    mask
                    src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                  />
                </div>
                <div className="right">
                  <p>小米SU7营销复盘：你所知道的为什么都是错的-Vol 46</p>
                  <p>
                    本期节目关注风口上的小米汽车，主播借助在营销、产品上的经验解答。欢迎在评论区留言发表你对小米汽车的感受与看法，对于节目话题的更多观点，获取更多未呈现在节目中的扩展阅读，欢迎加群讨论
                  </p>
                  <p>
                    <span>30分钟 · 03/29</span>
                    <span>
                      <SlEarphones />
                      4.3万+
                      <SlBubble />
                      349
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </div>
  )
}
