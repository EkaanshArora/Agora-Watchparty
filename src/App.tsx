import React, { CSSProperties, useState } from 'react'
import { PropsContext, GridVideo, LocalControls, RtcConfigure, TracksConfigure, RtmConfigure, RemoteMutePopUp, LocalUserContext } from 'agora-react-uikit'
import VirtualBackground from './VirtualBackground'
import 'agora-react-uikit/dist/index.css'
import AgoraRTC from 'agora-rtc-sdk-ng'
import CloudPlayer from './CloudPlayer'
import CombineGridToCanvas from './CustomRender'

AgoraRTC.setLogLevel(3)
const App: React.FunctionComponent = () => {
  const [videocall, setVideocall] = useState(false)

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Agora React Web UI Kit</h1>
      {videocall ? (
        <>
          <PropsContext.Provider value={{
            rtcProps: {
              appId: '<Agora App ID>',
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
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <VirtualBackground />
                      <CloudPlayer />
                    </div>
                    <RemoteMutePopUp />
                    <GridVideo />
                    <CombineGridToCanvas />
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
  container: { display: 'flex', flex: 1, backgroundColor: '#007bff22', flexDirection: 'column' } as CSSProperties,
  heading: { textAlign: 'center' as const, marginBottom: 0 },
  nav: { display: 'flex', justifyContent: 'space-around' },
  btn: { backgroundColor: '#007bff', cursor: 'pointer', borderRadius: 100, padding: 15, color: '#ffffff', fontSize: 16, margin: 'auto', paddingLeft: 50, paddingRight: 50, marginBottom: 20, marginTop: 10 }
}

export default App