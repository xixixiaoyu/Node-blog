const redis = require('redis')
const { REDIS_CONF } = require('../conf/db.js')

// REDIS_CONF = {
//   host: '127.0.0.1',
//   port: '6379'
// }

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', err => {
  console.log(err)
})

function set(key, value) {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  redisClient.set(key, value, redis.print)
}

function get(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, value) => {
      if (err) {
        reject(err)
        return
      }
      if (value == null) {
        resolve(null)
        return
      }
      try {
        // 对应 if(typeof value === 'object') {...}
        resolve(JSON.parse(value))
      } catch (ex) {
        resolve(value)
      }
    })
  })
}

module.exports = {
  set,
  get
}
