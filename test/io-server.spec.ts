#!/usr/bin/env ts-node

import * as http from 'http'

import * as test from 'tap'

import { IoServer } from '../src/io-server'

test('IoServer smoking test', t => {
  const server = http.createServer()
  const ioServer = new IoServer(server)

  t.ok(ioServer, 'should instanciated an IoServer')

  t.end()
})
