// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html
// https://github.com/Microsoft/TypeScript/issues/2076#issuecomment-75052599

import * as http from 'http'

interface IoServer {
  new (server: http.Server): IoServer
  init(): Promise<IoServer | void>
}

export const IoServer: IoServer
