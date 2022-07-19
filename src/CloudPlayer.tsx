import { MaxUidContext, MinUidContext } from 'agora-react-uikit';
import { useContext, useEffect, useState } from 'react';

const serverUrl = "<Your_Backend_URL>" // enter the backend url 
// you can find a demo project here: (https://github.com/EkaanshArora/Agora-Cloud-Player-Backend)

const body = {
  channel: "test",
  uid: 1,
  token: null,
  url: "<Video_URL>" // enter video url
}


const CloudPlayer = () => {
  const [isBtnDisabled, setBtnDisabled] = useState(false)
  const max = useContext(MaxUidContext)
  const min = useContext(MinUidContext)

  // disable button if UID 1 (CP user) is connected
  useEffect(() => {
    let users = [...min, ...max];
    let flag = false
    users.forEach(u => {
      if (u.uid === 1) {
        flag = true;
      }
    })
    if (flag) {
      setBtnDisabled(true)
    } else {
      setBtnDisabled(false)
    }
  }, [min, max])

  const playVideo = async () => {
    setBtnDisabled(true)
    let res = await fetch(serverUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body)
    })
    let json = await res.json()
    console.log(json)
    setBtnDisabled(false)
  }

  return (<>
    <div style={isBtnDisabled ? disabledBtn : btn} onClick={() => {
      if (!isBtnDisabled) {
        playVideo()
      }
    }}>
      {isBtnDisabled ? 'Requesting...' : 'Stream Video from Cloud'}
    </div>
  </>
  )
}
const btn = { backgroundColor: '#007bff', cursor: 'pointer', borderRadius: 100, padding: 15, color: '#ffffff', fontSize: 16, margin: 'auto', paddingLeft: 50, paddingRight: 50, marginBottom: 20, marginTop: 10 }
const disabledBtn = { ...btn, opacity: 0.2 }

export default CloudPlayer;