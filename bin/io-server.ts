/**
 * TypeScript need to keep the file extention as `.ts`
 * https://github.com/TypeStrong/ts-node/issues/116#issuecomment-234995536
 */

import * as http from 'http'

import log from 'brolog'

import { IoServer } from '../'

async function main(): Promise<void> {
  log.level('silly')

  const server  = http.createServer()
  const port    = process.env.PORT as number || 8080 // process.env.PORT is set by Heroku/Cloud9

  server.listen(port, _ => log.info('io-server', 'Listening on ' + server.address().port))

  const ioServer = new IoServer(server)
  try {
    await ioServer.init()
    log.info('io-server', 'init succeed')
  } catch(e) {
    log.error('io-server', 'init failed: %s', e.message)
    throw e
  }
  return
}

main()
