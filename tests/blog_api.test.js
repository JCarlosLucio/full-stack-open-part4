const mongoose = require('mongoose');
const supertest = require('supertest');
const { initialBlogs, blogsInDb } = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe('when there are initially blogs saved', () => {
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

  test('blog unique identifier is named id', async () => {
    const response = await api.get('/api/blogs');

    const blogToTest = response.body[0];
    expect(blogToTest.id).toBeDefined();
  });
});

describe('addition of a new blog', () => {
  test('a blog can be added', async () => {
    const newBlog = {
      title: 'New blog for test',
      author: 'Tester',
      url: 'https://newblogtest.com',
      likes: 3,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain('New blog for test');
  });

  test('a blog without likes property defaults to 0', async () => {
    const newBlog = {
      title: 'No likes property',
      author: 'Tester',
      url: 'https://nolikestest.com',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await blogsInDb();
    const addedBlog = blogsAtEnd[blogsAtEnd.length - 1];
    expect(addedBlog.likes).toBe(0);
  });

  test('a blog without title/url properties returns 400 Bad Request', async () => {
    const newBlog = {
      author: 'Tester',
      likes: 4,
    };

    await api.post('/api/blogs').send(newBlog).expect(400);
  });
});

describe('deletion of a blog', () => {
  test('succeds with status 204 if id is valid', async () => {
    const blogsAtStart = await blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
