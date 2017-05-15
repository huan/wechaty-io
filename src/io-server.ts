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

import { log } from 'brolog'
if (process.env.WECHATY_LOG) {
  log.level(process.env.WECHATY_LOG)
  log.verbose('IoServer', 'Npmlog set log.level(%s) from env.WECHATY_LOG', log.level())
}

import { IoAuth }     from './io-auth'
import { IoManager }  from './io-manager'
import { IoSocket }   from './io-socket'

export class IoServer {
  ioManager = new IoManager()
  ioAuth = new IoAuth()

  ioSocket: IoSocket

  constructor(
    private server: http.Server
  ) {
    this.ioSocket = new IoSocket(
      server,
      this.ioAuth.auth.bind(this.ioAuth),
      // this will hook unRegister well
      this.ioManager.register.bind(this.ioManager),
    )
  }

  async init() {
    await this.ioSocket.init()
    return this
  }
}
