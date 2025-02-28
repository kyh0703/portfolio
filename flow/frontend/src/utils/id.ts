import { v4 as uuidv4 } from 'uuid'

function generateShortId() {
  return Buffer.from(uuidv4().replace(/-/g, ''), 'hex')
    .toString('base64')
    .replace(/[/+=]/g, '')
}

export { generateShortId }
