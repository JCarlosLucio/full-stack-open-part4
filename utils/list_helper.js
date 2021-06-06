const dummy = () => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) =>
  blogs.reduce((prev, curr) => (prev.likes > curr.likes ? prev : curr));

const mostBlogs = (blogs) => {
  // creates an object of author objects (with author, blogs properties):
  // authors = {'name of author':{author:'name of author', blogs: 0}, ...};
  const authors = blogs.reduce((acc, val) => {
    acc[val.author] = {
      author: val.author,
      blogs: (acc[val.author]?.blogs || 0) + 1,
    };
    return acc;
  }, {});

  // creates an array of author objects [{author:'name of author', blogs: 0},...]
  // and returns the one with most blogs
  return Object.values(authors).reduce((prev, curr) =>
    prev.blogs > curr.blogs ? prev : curr
  );
};

const mostLikes = (blogs) => {
  const authors = blogs.reduce((acc, val) => {
    acc[val.author] = {
      author: val.author,
      likes: (acc[val.author]?.likes || 0) + val.likes,
    };
    return acc;
  }, {});

  return Object.values(authors).reduce((prev, curr) =>
    prev.likes > curr.likes ? prev : curr
  );
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
