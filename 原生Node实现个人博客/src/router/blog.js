const { SuccessModel, ErrorModel } = require('../model/resModel')
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog.js')

const handleBlogRouter = (req, res) => {
	const method = req.method
	const path = req.path
	const id = req.query.id

	// 获取博客列表
	if (method === 'GET' && path === '/api/blog/list') {
		const author = req.query.author || ''
		const keyword = req.query.keyword || ''
		const listData = getList(author, keyword)
		return new SuccessModel(listData)
	}

	// 获取博客详情
	if (method === 'GET' && path === '/api/blog/detail') {
		const data = getDetail(id)
		return new SuccessModel(data)
	}

	// 创建博客
	if (method === 'POST' && path === '/api/blog/new') {
		const blogData = newBlog(req.body)
		return new SuccessModel(blogData)
	}

	// 更新博客
	if (method === 'POST' && path === '/api/blog/update') {
		const res = updateBlog(id, req.body)
		if (res) {
			return new SuccessModel()
		}

		return new ErrorModel('更新失败')
	}

	// 删除博客
	if (method === 'POST' && path === '/api/blog/update') {
		const res = delBlog(id)
		if (res) {
			return new SuccessModel()
		}
		return new ErrorModel('删除失败')
	}
}

module.exports = handleBlogRouter
