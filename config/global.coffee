crypto = require 'crypto'

config = {
    secret: crypto.randomBytes(128).toString "base64"
    alers: {}
    notify: {}
		host: '192.163.201.155:3000'
}

module.exports = config
