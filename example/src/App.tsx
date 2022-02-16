import React, { CSSProperties, useState } from 'react'
import { createChannel, createClient, RtmMessage } from 'agora-rtm-react'

export const useClient = createClient('<Your Agora App ID>');
export const useChannel = createChannel('test')

const App = () => {
  const client = useClient();
  const testChannel = useChannel(client)
  const [texts, setTexts] = useState<messageStore[]>([])
  const [uid, setUid] = useState<string>('')
  const [textInput, setTextInput] = useState<string>('')
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false)

  let login = async () => {
    await client.login({ uid })
    await testChannel.join()
    client.on('ConnectionStateChanged', async (state, reason) => {
      console.log('ConnectionStateChanged', state, reason)
    })
    testChannel.on('ChannelMessage', (msg, uid) => {
      setTexts((previous) => {
        return [...previous, { msg, uid }]
      })
    })
    testChannel.on('MemberJoined', (memberId) => {
      console.log('New Member: ', memberId)
    })
    setLoggedIn(true)
  }

  let logout = async () => {
    await testChannel.leave()
    await client.logout()
    testChannel.removeAllListeners()
    client.removeAllListeners()
    setLoggedIn(false)
  }

  const sendMsg = async (text: string) => {
    let message = client.createMessage({ text, messageType: 'TEXT' })
    await testChannel.sendMessage(message)
    setTexts((previous) => {
      return [...previous, { msg: { text }, uid }]
    })
    setTextInput('')
  }

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', height: '90vh', margin: 8 }}>
      <h1 style={{ textAlign: 'center' }}>Agora RTM Wrapper Demo</h1>
      <div style={{ display: 'flex', margin: 'auto' }}>
          <p style={{marginRight: 5}}>Enter a user ID: </p>
          <input style={{marginRight: 5}} type='text' disabled={isLoggedIn} value={uid} onChange={e => setUid(e.target.value)} />
          <button disabled={!uid} style={btnStyle} onClick={isLoggedIn ? logout : login}>{isLoggedIn ? 'Logout' : 'Login'}</button>
      </div>
      <div style={{ display: 'flex', flex: 10, flexDirection: 'column', margin: 20, marginLeft: '10%', marginRight: '10%', backgroundColor: '#efefef', paddingRight: 10, paddingLeft: 10, overflowY: 'scroll'}}>
        {texts.map((text: messageStore, i) =>
          <div key={i} style={{ backgroundColor: text.uid === uid ? '#007bff50' : '#ccc', margin: 10, width: '50%', marginLeft: text.uid === uid ? 'auto' : '', padding: 12, borderRadius: 10 }}>
            <div style={{fontSize: 12, opacity: 0.5}}>{text.uid}</div>
            <div>{text.msg['text']}</div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', justifySelf: 'flex-end' }}>
      <div style={{display: 'flex', flexDirection: 'row', flex: '1', marginRight: '10%', marginLeft: '10%', height: 40}}>
          <input style={{width: '100%', marginRight: 20}} type='text' value={textInput} onChange={e => setTextInput(e.target.value)} />
          <button style={{...btnStyle, opacity: isLoggedIn && textInput ? 1 : 0.5}} disabled={!isLoggedIn || !textInput} onClick={() => sendMsg(textInput)}>Send Message</button>
      </div>
      </div>
    </div>
  )
}

const btnStyle = { backgroundColor: '#007bff', borderWidth: 0, borderRadius: 10, color: '#fff', width: 200, fontWeight: 'bold', fontSize: 16 } as CSSProperties

export type messageStore = {
  msg: RtmMessage;
  uid: string;
}

export default App
