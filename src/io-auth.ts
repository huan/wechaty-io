/**
 *
 * Wechaty Io Server Class
 *
 * IoAuth
 *
 * https://github.com/zixia/wechaty
 *
 */
import * as http from 'http'
import { log } from 'brolog'

class IoAuth {
  constructor() {
    log.verbose('IoAuth', 'constructor()')
  }

  auth(req: http.ServerRequest): Promise<string | void> {
    log.verbose('IoAuth', 'auth()')
    const token = this.getToken(req)

    if (!token) {
      return Promise.reject(new Error('cannot get token from request'))
    }

    if (token) {
      return Promise.resolve(token)
    }
    return Promise.reject(new Error('auth failed'))
  }

  private getToken(req: http.ServerRequest): string {
    log.verbose('IoAuth', 'getToken()')
    const token = authToken(req.headers.authorization)
               || urlToken(req.url)

    return token

    /////////////////////////

    function urlToken(url: string): string | null {
      const matches = String(url).match(/token\/(.+)$/i)
      return matches && matches[1] || null
    }

    function authToken(authorization: string): string | null {
      // https://github.com/KevinPHughes/ws-basic-auth-express/blob/master/index.js
      if (!authorization) {
        log.verbose('IoAuth', 'authToken() no authorization')
        return null
      }
      const parts = authorization.split(' ')
      if (parts.length !== 2) {
        log.verbose('IoAuth', 'authorization part is not 2')
        return null
      }
      const scheme = parts[0]
      const token = parts[1]
      if (!/Token/i.test(scheme) || !token) {
        log.verbose('IoAuth', 'authorization schema is not Token')
        return null
      }
      return token
    }
  }
}

export { IoAuth }
