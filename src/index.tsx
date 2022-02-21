import AgoraRTM, { RtmChannel, RtmClient } from 'agora-rtm-sdk'

export default AgoraRTM
export * from 'agora-rtm-sdk'

/**
 * Returns a hook to access an RTM client, use this outside your React component.
 * The returned hook gives the same client throughout the application lifecycle.
 * @param appId Agora AppID
 * @param config RTM Config
 * @param areaCodes Area Code
 * @returns React Hook to access client object
 */
export const createClient = (
  appId: string,
  config?: RtmConfig,
  areaCodes?: AreaCode[]
) => {
  let client: RtmClient
  /**
   * A React Hook to access the RTM Client
   * @returns RTM Client
   */
  function createClosure() {
    if (!client) {
      client = AgoraRTM.createInstance(appId, config, areaCodes)
    }
    return client
  }
  return () => createClosure()
}

/**
 * Returns a hook to access an RTM channel instance, use this outside your React component.
 * The returned hook gives the same channel instance throughout the application lifecycle.
 * @param channelId RTM Channel ID
 * @returns A React hook to access the channel instace
 */
export const createChannel = (channelId: string) => {
  let channel: RtmChannel
  /**
   * A React Hook to access the RTM Channel
   * @returns RTM Channel Instance
   */
  function createClosure(client: RtmClient) {
    if (!channel) {
      channel = client.createChannel(channelId)
    }
    return channel
  }
  return (client: RtmClient) => createClosure(client)
}

/**
 * Returns a hook to access an RTM client instance, use this outside your React component.
 * The returned hook accepts the RTM config on the first hook call and gives the same channel instance throughout the application lifecycle.
 * Use this when you need to create a client but the config is only available during the application runtime, don't update the config between re-renders.
 * @returns A React Hook that give you access to the RTM Client instance.
 */
export const createLazyClient = () => {
  let client: RtmClient
  /**
   * A React hook that gives you access to the RTM Client instance
   * @param appId Agora App ID
   * @param config RTM Client Config
   * @param areaCodes areaCodes
   * @returns RTM Client instance
   */
  function createClosure(
    appId: string,
    config?: RtmConfig,
    areaCodes?: AreaCode[]
  ) {
    if (!client) {
      client = AgoraRTM.createInstance(appId, config, areaCodes)
    }
    return client
  }
  return (appId: string, config?: RtmConfig, areaCodes?: AreaCode[]) =>
    createClosure(appId, config, areaCodes)
}
/**
 * Returns a hook to access an RTM channel instance, use this outside your React component.
 * The returned hook accepts the channel config on the first hook call and gives the same channel instance throughout the application lifecycle.
 * Use this when you need to create a client but the config is only available during the application runtime, don't update the config between re-renders.
 * @returns A React Hook to access the RTM channel instance
 */
export const createLazyChannel = () => {
  let channel: RtmChannel
  function createClosure(client: RtmClient, channelId: string) {
    if (!channel) {
      channel = client.createChannel(channelId)
    }
    return channel
  }
  return (client: RtmClient, channelId: string) =>
    createClosure(client, channelId)
}

/**
 * @ignore
 */
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

/**
 * @ignore
 */
type LogFilterType = {
  error: boolean
  warn: boolean
  info: boolean
  track: boolean
  debug: boolean
}

/**
 * @ignore
 */
enum AreaCode {
  GLOBAL = 'GLOBAL',
  INDIA = 'INDIA',
  JAPAN = 'JAPAN',
  ASIA = 'ASIA',
  EUROPE = 'EUROPE',
  CHINA = 'CHINA',
  NORTH_AMERICA = 'NORTH_AMERICA'
}
