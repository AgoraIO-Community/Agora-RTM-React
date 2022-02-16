import AgoraRTM, { RtmChannel, RtmClient } from 'agora-rtm-sdk'

export default AgoraRTM
export * from 'agora-rtm-sdk'

export const createClient = (
  appId: string,
  config?: RtmConfig,
  areaCodes?: RtmStatusCode.AreaCode[]
) => {
  let client: RtmClient
  function createClosure() {
    if (!client) {
      client = AgoraRTM.createInstance(appId, config, areaCodes)
    }
    return client
  }
  return () => createClosure()
}

export const createChannel = (channelId: string) => {
  let channel: RtmChannel
  function createClosure(client: RtmClient) {
    if (!channel) {
      channel = client.createChannel(channelId)
    }
    return channel
  }
  return (client: RtmClient) => createClosure(client)
}

// export const createLocalInvitation = (calleeId: string) => {
//   let invitation: LocalInvitation
//   function createClosure(client: RtmClient) {
//     if (!invitation) {
//       invitation = client.createLocalInvitation(calleeId)
//     }
//     return invitation
//   }
//   return (client: RtmClient) => createClosure(client)
// }
interface RtmConfig {
  /**
   * Whether to enable log upload. It is set to `false` by default.
   * - `true`: Enable log upload,
   * - `false`: (Default) Disable log upload.
   */
  enableLogUpload?: boolean

  /**
   * Output log level of the SDK.
   *
   * You can use one or a combination of the filters. The log level follows the sequence of OFF, ERROR, WARNING, and INFO. Choose a level to see the logs preceding that level. If, for example, you set the log level to WARNING, you see the logs within levels ERROR and WARNING.
   *
   *  - {@link AgoraRTM.LOG_FILTER_OFF}
   *  - {@link AgoraRTM.LOG_FILTER_ERROR}
   *  - {@link AgoraRTM.LOG_FILTER_INFO} (Default)
   *  - {@link AgoraRTM.LOG_FILTER_WARNING}
   */
  logFilter?: LogFilterType

  /**
   * Whether to enable cloud proxy.
   */
  enableCloudProxy?: boolean
}

type LogFilterType = {
  error: boolean
  warn: boolean
  info: boolean
  track: boolean
  debug: boolean
}

declare namespace RtmStatusCode {
  enum AreaCode {
    GLOBAL = 'GLOBAL',
    INDIA = 'INDIA',
    JAPAN = 'JAPAN',
    ASIA = 'ASIA',
    EUROPE = 'EUROPE',
    CHINA = 'CHINA',
    NORTH_AMERICA = 'NORTH_AMERICA'
  }
}
