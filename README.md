# Agora RTM SDK React Wrapper

A thin react.js wrapper for [Agora RTM SDK](https://www.npmjs.com/package/agora-rtm-sdk).

This wrapper supports **React >= v16.8**

## Install
```bash
npm install agora-rtm-react
```

## Usage
```tsx
import React from 'react'
import { createChannel, createClient, RtmMessage } from 'agora-rtm-react'

const useClient = createClient('<Agora App ID>');
const useChannel = createChannel('channelName')

const App = () => {
  const client = useClient();
  const testChannel = useChannel(client)

  const login = async () => {
    await client.login({ uid: 'userId' })
    await testChannel.join()
  }
  
  const sendMsg = async (text: string) => {
    const message = client.createMessage({ text, messageType: 'TEXT' })
    await testChannel.sendMessage(message)
  }
...
}

``` 

## Example
A chat example using the wrapper can be found in `./example`

## Docs
You can view the [wrapper docs](https://agoraio-community.github.io/Agora-RTM-React), [Web SDK docs](https://docs.agora.io/en/Real-time-Messaging/landing-page?platform=Web) and the [SDK API Reference](https://docs.agora.io/en/Real-time-Messaging/API%20Reference/RTM_web/v1.4.3/index.html)