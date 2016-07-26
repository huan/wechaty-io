/**
 * 
 * Wechaty Io Server Class
 * 
 * IoManager
 * 
 * https://github.com/zixia/wechaty
 * 
 */

import * as log from 'npmlog'
import * as WebSocket from 'ws'

import { Listag } from 'listag'

import { ClientInfo } from './io-socket'

type ServerEventName = 
	'sys'
//   | 'online'
//   | 'offline'

type WechatyEventName = 
  'scan'
  | 'login'
  | 'logout'
  | 'message'
  | 'heartbeat'
  | 'error'
  | 'ding'
  | 'dong'

type EventName =
  'raw'
  | ServerEventName
  | WechatyEventName

interface IoEvent {
  name: EventName
  payload: string | Object
}

class IoManager {
  ltSocks = new Listag()

  constructor() {
    log.verbose('IoManager', 'constructor()')
  }

  register(client: WebSocket): void {
    log.verbose('IoManager', 'register()')

    // console.log(ws)
    // console.log(': ' + ws.upgradeReq.client.user)
    // upgradeReq.socket/connection/client

    const clientInfo = <ClientInfo>client['clientInfo']
    log.verbose('IoManager', 'register token[%s] protocol[%s] version[%s]'
                            , clientInfo.token
                            , clientInfo.protocol
                            , clientInfo.version
              )

    this.ltSocks.add(client, {
      protocol: clientInfo.protocol
      , token:  clientInfo.token
    })

    // var location = url.parse(client.upgradeReq.url, true);
    // you might use location.query.access_token to authenticate or share sessions
    // or client.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    client.on('message', this.onMessage.bind(this, client))
    client.on('error', this.unRegister.bind(this, client))
    client.on('close', this.unRegister.bind(this, client))

    // const onlineEvent: IoEvent = {
    //   name: 'online'
    //   , payload: 'protocol'
    // }
    // this.castBy(client, regEvent)

    const registerEvent: IoEvent = {
      name: 'sys'
      , payload: 'registered'
    }
    this.send(client, registerEvent)

    return
  }


  unRegister(client: WebSocket, e: any ) {
    log.verbose('IoManager', 'unregister(%s)', e)

    this.ltSocks.del(client)
    client.close()

    // const offlineEvent: IoEvent = {
    //   name: 'offline'
    //   , payload: 'protocol'
    // }
    // this.castBy(client, offlineEvent)
  }

  onMessage(client: WebSocket, data: any) {
    log.verbose('IoManager', 'onMessage() received: %s', data)

    let ioEvent: IoEvent = {
      name: 'raw'
      , payload: data
    }
    try {
      const obj = JSON.parse(data)
      ioEvent.name    = obj.name
      ioEvent.payload = obj.payload
    } catch (e) {
      log.warn('IoManager', 'onMessage() parse data fail. orig data: [%s]', data)
    }
    this.castBy(client, ioEvent)

    const rogerEvent: IoEvent = {
      name: 'sys'
      , payload: 'roger'
    }
    this.send(client, rogerEvent)
  }

  send(client: WebSocket, ioEvent: IoEvent) {
    const clientInfo = <ClientInfo>client['clientInfo']
    log.verbose('IoManager', 'send() token[%s], event[%s:%s])'
                          , clientInfo.token
                        , ioEvent.name
                      , ioEvent.payload
               )
    return client.send(JSON.stringify(ioEvent))
  }

  castBy(client: WebSocket, ioEvent: IoEvent): void {
    log.verbose('IoManager', 'castBy()')

    const clientInfo = <ClientInfo>client['clientInfo']
    log.verbose('IoManager', 'castBy() token[%s] protocol[%s]', clientInfo.token, clientInfo.protocol)

    const tagMap = {
      protocol: '-' + clientInfo.protocol
      , token:  clientInfo.token
    }

    const socks = this.ltSocks.get(tagMap)

    log.verbose('IoManager', 'castBy() tagMap: %s', JSON.stringify(tagMap))
    log.verbose('IoManager', 'castBy() ltSocks length: %d', (this.ltSocks && this.ltSocks.length))
    log.verbose('IoManager', 'castBy() filtered socks length: %d', (socks && socks.length))

    this.ltSocks.forEach(v => {
      // console.log('user: ' + v.user)
      let tagMapTmp = this.ltSocks.getTag(v)
      log.verbose('IoManager', 'castBy() tagMapTmp: %s', JSON.stringify(tagMapTmp))
    })

    if (socks) {
      log.verbose('IoManager', 'castBy() found %d socks', socks.length)
      socks.forEach(s => {
        if (s.readyState === WebSocket.OPEN) {
          log.verbose('IoManager', 'castBy() sending to sock now')
          this.send(s, ioEvent) // s.send(fromLocation + '[' + user + ']: ' + message)
        } else {
          log.verbose('IoManager', 'castBy() skipped an non-OPEN WebSocket')
        }
      })
    }
  }
}

export { IoManager, IoEvent }
