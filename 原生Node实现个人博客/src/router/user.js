const { SuccessModel, ErrorModel } = require('../model/resModel')
const { loginCheck } = require('../controller/user')

const handleUserRouter = (req, res) => {
	const method = req.method
	const path = req.path

	if (method === 'POST' && path === '/api/blog/login') {
		const { username, password } = req.body
		const res = loginCheck(username, password)

		if (res) {
			return new SuccessModel()
		}
		return new ErrorModel('登录失败')
	}
}

module.exports = handleUserRouter
