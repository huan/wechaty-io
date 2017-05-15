/**
 * TypeScript need to keep the file extention as `.ts`
 * https://github.com/TypeStrong/ts-node/issues/116#issuecomment-234995536
 */

import * as http from 'http'

import log from 'brolog'
// log.level = 'verbose'
log.level('silly')

import { IoServer } from '..'

const server = http.createServer()
const port = process.env.PORT || 8080 // process.env.PORT is set by Heroku/Cloud9

server.listen(port, _ => {
  log.info('io-server', 'Listening on ' + server.address().port)
})

const ioServer = new IoServer(server)
ioServer.init()
.then(_ => {
  log.info('io-server', 'init succeed')
})
.catch(e => {
  log.error('io-server', 'init failed')
})
