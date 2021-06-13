const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid ' });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({ ...request.body, user: user._id });

  const savedBlog = await blog.save();

  user.blogs = [...user.blogs, savedBlog._id];
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;
  const blog = { title, author, url, likes };
  const opts = { new: true };
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    opts
  );
  response.json(updatedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid ' });
  }

  const user = await User.findById(decodedToken.id);
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() === user._id.toString()) {
    // delete blog found by id
    await blog.deleteOne();

    // deletes blog id from user.blogs
    user.blogs = user.blogs.filter(
      (blogId) => blogId.toString() !== blog._id.toString()
    );
    await user.save();

    response.status(204).end();
  } else {
    response.status(403).json({ error: 'access denied' });
  }
});

module.exports = blogsRouter;
