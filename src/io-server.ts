/**
 * 
 * Wechaty Io Server Class
 * 
 * IoAuth
 * 
 * https://github.com/zixia/wechaty
 * 
 */

import * as http  from 'http'
import * as log   from 'npmlog'

import { IoAuth }     from './io-auth'
import { IoManager }  from './io-manager'
import { IoSocket }   from './io-socket'

class IoServer {
  ioManager = new IoManager()
  ioAuth = new IoAuth()

  ioSocket: IoSocket

  constructor(private server: http.Server) {
    this.ioSocket = new IoSocket(
      server
      , this.ioAuth.auth.bind(this.ioAuth)
      , this.ioManager.register.bind(this.ioManager)
    )
  }

  init() {
    this.ioSocket.init()
    return Promise.resolve(this)
  }
}

export { IoServer }