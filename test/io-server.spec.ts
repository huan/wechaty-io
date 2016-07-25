import * as http from 'http'

import { test } from 'tape'

import { IoServer } from '../index.ts'

test('IoServer smoking test', t => {
  const server = http.createServer()
  const ioServer = new IoServer(server)

  t.ok(ioServer, 'should instanciated an IoServer')

  t.end()
})
