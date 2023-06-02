const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const cleanCash = require("../middlewares/cleanCash");

const Blog = mongoose.model("Blog");

module.exports = (app) => {
  app.get("/api/blogs/:id", requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    });
    res.send(blog);
  });

  app.get("/api/blogs", requireLogin, async (req, res) => {
    // const redis = require("redis");
    // const util = require("util");
    // const redisUrl = "redis://127.0.0.1:7777";
    // const client = redis.createClient(redisUrl);
    // client.get = util.promisify(client.get);
    // const cachedBlogs = await client.get(`blog:${req.user.id}`);
    // if (cachedBlogs) {
    //   console.log("CACHE");
    //   return res.send(cachedBlogs);
    // }
    // console.log("NO CACHE!");
    const blogs = await Blog.find({ _user: req.user.id }).cache({
      key: req.user.id,
    });

    res.send(blogs);
    // client.set(`blog:${req.user.id}`, JSON.stringify(blogs), "EX", 10);
  });

  app.post("/api/blogs", requireLogin, cleanCash, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id,
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
