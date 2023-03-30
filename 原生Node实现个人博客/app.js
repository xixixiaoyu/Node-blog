const queryString = require('querystring')
const handleUserRouter = require('./src/router/user')
const handleBlogRouter = require('./src/router/blog')

const serverHandle = (req, res) => {
  // 设置返回格式为 json
  res.setHeader('Content-type', 'application/json')

  // 解析 path
  req.path = req.url.split('?')[0]

  // 解析 query
  req.query = queryString.parse(req.url.split('?')[1])

  // 解析 cookie
  req.cookie = parseCookie(req.headers.cookie)

  const [needSetCookie, session] = parseSession(req.cookie.userid)

  req.session = session

  // 获取请求体内容
  getPostData(req).then(postData => {
    req.body = postData

    // 登录路由
    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          res.setHeader(
            'Set-Cookie',
            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
          )
        }
        res.end(JSON.stringify(userData))
      })
      return
    }

    // 博客路由
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        // 操作 cookie
        if (needSetCookie) {
          res.setHeader(
            'Set-Cookie',
            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
          )
        }
        res.end(JSON.stringify(blogData))
      })
      return
    }

    // 未命中路由
    res.writeHead(404, { 'Content-type': 'text/plain' })
    res.write('404 Not Found')
    res.end()
  })
}

function getPostData(req) {
  return new Promise(resolve => {
    if (req.method !== 'POST') {
      return resolve({})
    }
    if (req.headers['content-type'] !== 'application/json') {
      return resolve({})
    }

    let postData = ''

    req.on('data', chunk => {
      postData += chunk.toString()
    })

    req.on('end', () => {
      if (!postData) {
        return resolve({})
      }

      resolve(JSON.parse(postData))
    })
  })
}

function parseCookie(cookie = '') {
  const cookieObj = Object.create(null)

  cookie.split(';').forEach(item => {
    if (!item) {
      return
    }

    const str = item.split('=')
    const key = str[0].trim()
    const val = str[1]
    cookieObj[key] = val
  })

  return cookieObj
}

function parseSession(userId) {
  const SESSION_DATA = {}

  let needSetCookie = false

  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {}
    } else {
      needSetCookie = true
      userId = `${Date.now()}_${Math.random()}`
      SESSION_DATA[userId] = {}
    }
  }

  return [needSetCookie, SESSION_DATA[userId]]
}

// 获取 cookie 过期时间
function getCookieExpires() {
  const d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000)
  return d.toGMTString()
}

module.exports = serverHandle
