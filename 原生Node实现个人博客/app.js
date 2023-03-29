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

	// 获取请求体内容
	getPostData(req).then(postData => {
		req.body = postData

		// 登录路由
		const userData = handleUserRouter(req, res)
		if (userData) {
			res.end(JSON.stringify(userData))
			return
		}

		// 博客路由
		const blogData = handleBlogRouter(req, res)
		if (blogData) {
			res.end(JSON.stringify(blogData))
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
			resolve({})
			return
		}
		if (req.headers['content-type'] !== 'application/json') {
			resolve({})
			return
		}

		let postData = ''
		req.on('data', chunk => {
			postData += chunk.toString()
		})
		req.on('end', () => {
			if (!postData) {
				resolve({})
				return
			}

			resolve(JSON.parse(postData))
		})
	})
}

module.exports = serverHandle
