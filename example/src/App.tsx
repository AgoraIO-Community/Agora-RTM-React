import React, { useState } from 'react'
import { createChannel, createClient, RtmMessage } from 'agora-rtm-react'

export const useClient = createClient('<Agora App ID>');
export const useChannel = createChannel('test')

const App = () => {
  const client = useClient();
  const testChannel = useChannel(client)
  const [texts, setTexts] = useState<messageStore[]>([])
  const [uid, setUid] = useState<string>('')
  const [textInput, setTextInput] = useState<string>('')
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false)

  const login = async () => {
    await client.login({ uid })
    await testChannel.join()
    client.on('ConnectionStateChanged', async (state, reason) => {
      console.log('ConnectionStateChanged', state, reason)
    })
    testChannel.on('ChannelMessage', (msg, uid) => {
      setTexts((previous) => {
        return [{ msg, uid }, ...previous]
      })
    })
    testChannel.on('MemberJoined', (memberId) => {
      console.log('New Member: ', memberId)
    })
    setLoggedIn(true)
  }

  const logout = async () => {
    await testChannel.leave()
    await client.logout()
    testChannel.removeAllListeners()
    client.removeAllListeners()
    setLoggedIn(false)
  }

  const sendMsg = async (text: string) => {
    const message = client.createMessage({ text, messageType: 'TEXT' })
    await testChannel.sendMessage(message)
    setTexts((previous) => {
      return [{ msg: {text}, uid }, ...previous]
    })
    setTextInput('')
  }

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', height: '95vh'}}>
      <h1 style={{ textAlign: 'center' }}>Agora RTM Wrapper Demo</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{height: 40}}>
          <p>UID:</p>
          <input type='text' disabled={isLoggedIn} value={uid} onChange={e => setUid(e.target.value)} />
          <button disabled={!uid} style={btnStyle} onClick={isLoggedIn ? logout : login}>{isLoggedIn ? 'Logout' : 'Login'}</button>
        </div>
        <div>
          <p>Message:</p>
          <input type='text' value={textInput} onChange={e => setTextInput(e.target.value)} />
          <button style={btnStyle} disabled={!isLoggedIn || !textInput} onClick={() => sendMsg(textInput)}>Send</button>
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', marginLeft: '10%', marginRight: '10%', marginTop: 30, backgroundColor: '#fafafa'}}>
        {texts.map((text: messageStore, i) =>
          <div key={i} style={{padding: 10, backgroundColor: '#eee', borderRadius: 10, margin: 10}}>
            <div>{text.uid}</div>
            <div>{text.msg['text']}</div>
          </div>
        )}
      </div>
    </div>
  )
}

const btnStyle = { backgroundColor: '#007bff', borderWidth: 0, borderRadius: 10, color: '#fff', width: 200, height: 30, marginLeft: 10 }

export type messageStore = {
  msg: RtmMessage;
  uid: string;
}

export default App
