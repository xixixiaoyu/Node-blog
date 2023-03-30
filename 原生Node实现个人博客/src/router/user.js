const { SuccessModel, ErrorModel } = require('../model/resModel')
const { loginCheck } = require('../controller/user')

const handleUserRouter = (req, res) => {
  const method = req.method
  const path = req.path

  if (method === 'GET' && req.path === '/api/user/logintest') {
    if (req.session.username) {
      return Promise.resolve(
        new SuccessModel({
          session: req.session
        })
      )
    }
    return Promise.resolve(new ErrorModel('登录失败'))
  }

  if (method === 'POST' && path === '/api/blog/login') {
    const { username, password } = req.body
    const result = loginCheck(username, password)

    return result.then(data => {
      if (data.username) {
        req.session.username = data.username
        return new SuccessModel()
      } else {
        return new ErrorModel('登录失败')
      }
    })
  }
}

// 获取 cookie 过期时间
function getCookieExpires() {
  const d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000)
  return d.toGMTString()
}

module.exports = handleUserRouter
