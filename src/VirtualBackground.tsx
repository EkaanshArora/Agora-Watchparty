import VirtualBackgroundExtension, { IVirtualBackgroundProcessor } from "agora-extension-virtual-background";
import AgoraRTC from 'agora-rtc-sdk-ng';
import { TracksContext } from 'agora-react-uikit';
import { useContext, useEffect, useRef } from 'react';

const VirtualBackground = () => {
  const { localVideoTrack } = useContext(TracksContext)
  const ext = useRef(new VirtualBackgroundExtension())
  const processor = useRef<IVirtualBackgroundProcessor>();

  useEffect(() => {
    const initExtension = async () => {
      AgoraRTC.registerExtensions([ext.current]);
      processor.current = ext.current.createProcessor()
      await processor.current.init('https://ekaansharora.github.io/test-wasm-host/')
    }
    const enableBackground = async () => {
      if (processor.current && localVideoTrack) {
        localVideoTrack.pipe(processor.current).pipe(localVideoTrack.processorDestination);
        processor.current.setOptions({ type: 'color', color: '#00ff00' });
        await processor.current.enable();
      }
    }
    initExtension().then(() => {
      enableBackground()
    })
  }, [localVideoTrack])



  return (
    <></>
  )
}

export default VirtualBackground;
