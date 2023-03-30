const { SuccessModel, ErrorModel } = require('../model/resModel')
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog.js')

const handleBlogRouter = (req, res) => {
  const method = req.method
  const path = req.path
  const id = req.query.id

  // 获取博客列表
  if (method === 'GET' && path === '/api/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    const result = getList(author, keyword)
    return result.then(listData => {
      return new SuccessModel(listData)
    })
  }

  // 获取博客详情
  if (method === 'GET' && path === '/api/blog/detail') {
    const result = getDetail(id)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  // 创建博客
  if (method === 'POST' && path === '/api/blog/new') {
    const result = newBlog(req.body)
    return result.then(blogData => {
      return new SuccessModel(blogData)
    })
  }

  // 更新博客
  if (method === 'POST' && path === '/api/blog/update') {
    const result = updateBlog(id, req.body)
    return result.then(val => {
      if (res) {
        return new SuccessModel()
      }

      return new ErrorModel('更新失败')
    })
  }

  // 删除博客
  if (method === 'POST' && path === '/api/blog/update') {
    const author = 'yunmu'
    req.body.author = author // 创建假数据
    const result = delBlog(id, author)
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('删除失败')
      }
    })
  }
}

module.exports = handleBlogRouter
