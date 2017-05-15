/**
 *
 * Wechaty Io Server Class
 *
 * IoSocket
 *
 * https://github.com/zixia/wechaty
 *
 */
import * as WebSocket from 'ws'
import * as http from 'http'
import { log } from 'brolog'

export type IoProtocol = 'io' | 'web'

interface ClientInfo {
  token:    string
  protocol: IoProtocol
  version:  string
  uuid:     string
}

class IoSocket {
  wss: WebSocket.Server

  constructor(
    private server: http.Server,
    private auth: (req: http.ServerRequest) => Promise<string>,
    private connect: (client: WebSocket) => void,
  ) {
    log.verbose('IoSocket', 'constructor()')
  }

  async init(): Promise<void> {
    log.verbose('IoSocket', 'init()')

    // https://github.com/websockets/ws/blob/master/doc/ws.md
    const options = {
      handleProtocols:  this.handleProtocols.bind(this),
      verifyClient:     this.verifyClient.bind(this),
      server:           this.server,
      // , host: process.env.IP
      // , port: process.env.PORT
    }
    this.wss = new WebSocket.Server(options)
    this.wss.on('connection', client => {
      const [protocol, version, uuid] = client.protocol.split('|')
      const token = client.upgradeReq['token']

      const clientInfo: ClientInfo = {
        protocol: <IoProtocol>protocol,
        token,
        version,
        uuid,
      }
      client['clientInfo'] = clientInfo
      this.connect(client)
    })

    return
  }

  /**
   * https://bugs.chromium.org/p/chromium/issues/detail?id=398407#c2
   */
  private handleProtocols(protocols, done) {
    log.verbose('IoSocket', 'handleProtocols() protocols: ' + protocols)
    done(true, protocols[0])
  }

  /**
   * check token for websocket client
   * http://stackoverflow.com/a/19155613/1123955
   */
  private async verifyClient(
    info: {
      origin: string,
      secure: boolean,
      req: http.ServerRequest,
    },
    done: (res: boolean, code?: number, message?: string) => void
  ): Promise<void> {
    log.verbose('IoSocket', 'verifyClient()')

    const {origin, secure, req} = info
    log.verbose('IoSocket', 'verifyClient() req.url = %s', req.url)

    try {
      const token = await this.auth(req)
      log.verbose('IoSocket', 'verifyClient() auth succ for token: %s', token)

      req['token'] = token

      return done(true, 200, 'Ok')

    } catch (e) {
      log.verbose('IoSocket', 'verifyClient() auth fail: %s', e.message)

      return done(false, 401, 'Unauthorized: ' + e.message)

    }
  }
}

export { IoSocket, ClientInfo }
