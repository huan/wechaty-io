// declare module 'wechaty-io' {
  import * as http from 'http'

  interface IoServer {
    new (server: http.Server): IoServer
    init(): Promise<IoServer | void>
  }

  export const IoServer: IoServer
// }
