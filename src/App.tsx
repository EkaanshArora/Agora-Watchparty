import React, { CSSProperties, useContext, useEffect, useRef, useState } from 'react'
import { PropsContext, GridVideo, LocalControls, RtcConfigure, TracksConfigure, RtmConfigure, RemoteMutePopUp, LocalUserContext, MaxUidContext, MinUidContext, RtcContext } from 'agora-react-uikit'
import VirtualBackground from './VirtualBackground'
import 'agora-react-uikit/dist/index.css'
import AgoraRTC from 'agora-rtc-sdk-ng'

AgoraRTC.setLogLevel(3)
const App: React.FunctionComponent = () => {
  const [videocall, setVideocall] = useState(false)
  const [isEnableFx, setEnableFx] = useState(false)

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Agora React Web UI Kit</h1>
      {videocall ? (
        <>
          <PropsContext.Provider value={{
            rtcProps: {
              appId: '30a6bc89994d4222a71eba01c253cbc7',
              channel: 'test',
              token: null
            },
            styleProps: { gridVideoContainer: { display: 'none' } },
            callbacks: {
              EndCall: () => setVideocall(false),
            }
          }} >
            <TracksConfigure>
              <RtcConfigure>
                <LocalUserContext>
                  <RtmConfigure>
                    <VirtualBackground extensionActive={isEnableFx} setExtensionActive={setEnableFx} />
                    <RemoteMutePopUp />
                    <GridVideo />
                    <CombineGridToCanvas isEnableFx={isEnableFx} />
                    <LocalControls />
                  </RtmConfigure>
                </LocalUserContext>
              </RtcConfigure>
            </TracksConfigure>
          </PropsContext.Provider>
        </>
      ) : (
        <div style={styles.nav}>
          <h3 style={styles.btn} onClick={() => setVideocall(true)}>Start Call</h3>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { width: '100vw', height: '100vh', display: 'flex', flex: 1, backgroundColor: '#007bff22', flexDirection: 'column' } as CSSProperties,
  heading: { textAlign: 'center' as const, marginBottom: 0 },
  nav: { display: 'flex', justifyContent: 'space-around' },
  btn: { backgroundColor: '#007bff', cursor: 'pointer', borderRadius: 5, padding: 5, color: '#ffffff', fontSize: 20 }
}


const CombineGridToCanvas = (props: { isEnableFx: boolean }) => {
  const max = useContext(MaxUidContext)
  const min = useContext(MinUidContext)
  const { isEnableFx } = props;
  const drawFuncRef = useRef<number | null>(null)

  useEffect(() => {
    if (isEnableFx) {
      // console.log('!!UE')
      let videos = Array.from(document.getElementsByTagName('video')) //mediaStore[users[0].uid].videoTrack;
      videos = videos.filter(v => !v.id.startsWith('trackVideo'))
      let canvas = document.getElementById('display')! as HTMLCanvasElement;
      let ctx = canvas.getContext('2d')

      if (drawFuncRef.current) {
        console.log('!!clear', drawFuncRef.current)
        cancelAnimationFrame(drawFuncRef.current)
      }
      const tile = (640 / 1.5)
      const width = videos.length * tile
      ctx?.clearRect(0, 0, width + 640, 480)
      canvas.width = width
      canvas.style.width = String(width)

      let draw = () => {
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

          if (green > 66 && green > red && green > blue) {
            imageData.data[offset + 3] = 0
          }
        }
        ctx!.putImageData(imageData, 0, 0)
        drawFuncRef.current = requestAnimationFrame(draw)
      }
      drawFuncRef.current = requestAnimationFrame(draw)
      console.log('!!added', drawFuncRef.current, videos.length, videos)
    }
    return () => {
      if (drawFuncRef.current) {
        console.log('!!', drawFuncRef.current)
        cancelAnimationFrame(drawFuncRef.current)
      }
    }
  }, [max, min, isEnableFx])

  return (
    <div style={{ position: 'relative', height: '85%' }}>
      {isEnableFx ?
        <canvas id='display' style={{ flex: 1, position: 'absolute', left: 0, bottom: 0, zIndex: 1 }} height={480} width={640}></canvas>
        : <p style={{ padding: 10 }}>enable virtual background to start</p>
      }
      <video style={{ height: '82vh', position: 'absolute', bottom: 0 }} id="trackVideoMonkey" src="video.mp4" autoPlay={true} loop={true} />
    </div>
  )
}

export default App