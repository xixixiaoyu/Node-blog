const { exec } = require('../db/mysql.js')

const loginCheck = (username, password) => {
  const sql = `
		select username, realname from users where username='${username}' and password=${password};
	`
  return exec(sql).then(rows => {
    return rows[0] || {}
  })
}

module.exports = { loginCheck }
