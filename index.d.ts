/**
 * do not use `module` here?
 * http://stackoverflow.com/a/32805764/1123955
 */
// declare module 'wechaty-io' {
  import * as http from 'http'

  interface IoServer {
    new (server: http.Server): IoServer
    init(): Promise<IoServer | void>
  }

  export const IoServer: IoServer
// }
