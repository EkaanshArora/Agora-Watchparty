import { MaxUidContext, MaxVideoView, MinUidContext } from 'agora-react-uikit'
import React, { useContext, useRef } from 'react'

const GridVideo: React.FC = () => {
  const max = useContext(MaxUidContext)
  const min = useContext(MinUidContext)
  const users = [...max, ...min]

  const parentRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={parentRef}
      style={{ display: 'none' }}
    >
      {users.map((user) => {
        if (user.uid === 1) {
          return null;
        } else {
          return <MaxVideoView
            user={user}
            style={{ ...{ height: '100%', width: '100%' } }}
            key={user.uid}
          />
        }
      })}
    </div>
  )
}

export default GridVideo;
