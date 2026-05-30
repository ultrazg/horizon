import React from 'react'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import { useWindowSize } from '@/hooks'
import { BrowserOpenURL } from 'wailsjs/runtime'
import styles from './index.module.scss'

type IProps = {
  changelog: string
} & modalType

/** 解析行内 markdown：链接 [text](url) 与 inline code `code` */
const renderInline = (text: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = []
  const regex = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g
  let lastIndex = 0
  let key = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[1] !== undefined) {
      const label = match[1]
      const url = match[2]
      nodes.push(
        <a
          key={key++}
          className={styles.link}
          onClick={(e) => {
            e.preventDefault()
            BrowserOpenURL(url)
          }}
        >
          {label}
        </a>,
      )
    } else if (match[3] !== undefined) {
      nodes.push(
        <code
          key={key++}
          className={styles.code}
        >
          {match[3]}
        </code>,
      )
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

/** 将 changelog 的 markdown 文本解析为 React 节点 */
const renderMarkdown = (md: string): React.ReactNode[] => {
  const blocks: React.ReactNode[] = []
  let listItems: React.ReactNode[] = []
  let key = 0

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push(
        <ul
          key={`ul-${key++}`}
          className={styles.list}
        >
          {listItems}
        </ul>,
      )
      listItems = []
    }
  }

  md.split('\n').forEach((rawLine) => {
    const line = rawLine.trimEnd()

    if (line.startsWith('## ')) {
      flushList()
      blocks.push(
        <p
          key={`h-${key++}`}
          className={styles.version}
        >
          {renderInline(line.slice(3))}
        </p>,
      )
    } else if (line.startsWith('- ')) {
      listItems.push(
        <li
          key={`li-${key++}`}
          className={styles.item}
        >
          {renderInline(line.slice(2))}
        </li>,
      )
    } else if (line.trim() === '') {
      flushList()
    } else {
      flushList()
      blocks.push(
        <p
          key={`p-${key++}`}
          className={styles.label}
        >
          {renderInline(line)}
        </p>,
      )
    }
  })

  flushList()
  return blocks
}

const ChangelogModal: React.FC<IProps> = ({ changelog, open, onClose }) => {
  const { height } = useWindowSize()

  return (
    <Modal
      title="版本历史"
      open={open}
      onClose={onClose}
    >
      <div
        className={styles.content}
        style={{ maxHeight: `${height * 0.7}px`, overflowY: 'auto' }}
      >
        {renderMarkdown(changelog)}
      </div>
    </Modal>
  )
}

export default ChangelogModal
