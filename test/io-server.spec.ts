import { test } from 'tape'
import * as http from 'http'

import { IoServer } from '..'

test('IoServer smoking test', t => {
  const server = http.createServer()
  const ioServer = new IoServer(server)

  t.ok(ioServer, 'should instanciated an IoServer')

  t.end()
})
