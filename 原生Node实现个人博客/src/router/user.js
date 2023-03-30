const { SuccessModel, ErrorModel } = require('../model/resModel')
const { loginCheck } = require('../controller/user')

const handleUserRouter = (req, res) => {
  const method = req.method
  const path = req.path

  if (method === 'POST' && path === '/api/blog/login') {
    const { username, password } = req.body
    const result = loginCheck(username, password)

    return result.then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('登录失败')
      }
    })
  }
}

module.exports = handleUserRouter
