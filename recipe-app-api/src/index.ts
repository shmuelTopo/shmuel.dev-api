import App from './app'
import http from 'http'
import { Logger } from './logger'

const port = 3070

const logger = new Logger()

App.set('port', port)
const server = http.createServer(App)
server.listen(port)

server.on('listening', function (): void {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`
  logger.info(`Listening on ${bind}`)
})

export default server