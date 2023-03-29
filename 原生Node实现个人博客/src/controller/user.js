const loginCheck = (username, password) => {
	if (username === 'yunmu' && password === '123456') {
		return true
	}
	return false
}

module.exports = { loginCheck }
