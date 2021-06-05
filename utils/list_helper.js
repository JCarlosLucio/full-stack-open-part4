const dummy = () => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) =>
  blogs.reduce((prev, curr) => (prev.likes > curr.likes ? prev : curr));

module.exports = { dummy, totalLikes, favoriteBlog };
