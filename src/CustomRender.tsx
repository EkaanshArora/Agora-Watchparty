import React, { useContext, useEffect, useRef } from 'react'
import { MaxUidContext, MinUidContext, RtcContext } from 'agora-react-uikit'
import { AgoraVideoPlayer } from 'agora-rtc-react'

const CombineGridToCanvas = () => {
  const max = useContext(MaxUidContext)
  const min = useContext(MinUidContext)
  const { mediaStore } = useContext(RtcContext)
  const users = [...min, ...max]

  const drawFuncRef = useRef<number | null>(null)

  useEffect(() => {
    let videos = Array.from(document.getElementsByTagName('video')) //mediaStore[users[0].uid].videoTrack;
    console.log(videos)
    videos = videos.filter(v => !v.id.startsWith('trackVideo'))
    videos = videos.filter(v => !v.id.startsWith('video_track-video-1-client')) //video_track-video-1-client-335fc_8c5f7
    videos = videos.filter(v => v.id !== undefined) //video_track-video-1-client-335fc_8c5f7
    console.log(videos)
    let canvas = document.getElementById('display')! as HTMLCanvasElement;
    let ctx = canvas.getContext('2d')

    if (drawFuncRef.current) {
      cancelAnimationFrame(drawFuncRef.current)
    }
    const tile = (640 / 1.5)
    const width = videos.length * tile
    canvas.width = width
    canvas.style.width = String(width)

    let draw = () => {
      ctx?.clearRect(0, 0, width + 640, 480)
      videos.forEach((v, i) => {
        ctx?.drawImage(v, (640 - tile) / 2, 0, tile, 480, (i * tile), 0, tile, 480);
      })
      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height)
      const dataLength = imageData.data.length / 4
      for (let i = 0; i < dataLength; i++) {
        const offset = i * 4
        const red = imageData.data[offset + 0]
        const green = imageData.data[offset + 1]
        const blue = imageData.data[offset + 2]

        if (green > 90 && green > red && green > blue) {
          imageData.data[offset + 3] = 0
        }
      }
      ctx!.putImageData(imageData, 0, 0)
      drawFuncRef.current = requestAnimationFrame(draw)
    }
    drawFuncRef.current = requestAnimationFrame(draw)
    return () => {
      if (drawFuncRef.current) {
        cancelAnimationFrame(drawFuncRef.current)
      }
    }
  }, [max, min])

  return (
    <div style={{ position: 'relative', display: 'flex', flex: 1 }}>
      <canvas id='display' style={{ flex: 1, position: 'absolute', left: 0, bottom: 0, zIndex: 1 }} height={480} width={640}></canvas>
      <div style={{ flex: 1, display: 'flex', width: '100%', height: '80vh' }}>
        {users.map(u => {
          if (u.uid === 1) {
            if (mediaStore[1].videoTrack) return <AgoraVideoPlayer style={{ width: '100%', height: '100%', objectFit: 'cover' }} videoTrack={mediaStore[1].videoTrack} />
            else return null
          }
          else return null
        })}
      </div>
    </div>
  )
}

export default CombineGridToCanvas;
