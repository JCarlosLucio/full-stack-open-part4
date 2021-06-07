const mongoose = require('mongoose');
const supertest = require('supertest');
const { initialBlogs } = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogPromises = initialBlogs.map((blog) => {
    const blogObject = new Blog(blog);
    return blogObject.save();
  });
  await Promise.all(blogPromises);
});

describe('blog api', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
