import React from 'react'

type IProps = {
  description?: string
}

export const Empty: React.FC<IProps> = ({ description }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '80%',
        color: 'gray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem 0',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {description || '暂无数据'}
    </div>
  )
}
