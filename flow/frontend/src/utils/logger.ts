import * as logger from 'loglevel'

logger.setLevel(process.env.NODE_ENV === 'development' ? 'debug' : 'debug')

export default logger
