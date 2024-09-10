const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./model/User');
const Post = require('./model/Post');
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');

const uploadMiddleware = multer({ dest: 'uploads/' });
const app = express();
const saltRounds = 10; // Number of salt rounds for bcrypt
const secret = process.env.SECRET_KEY || 'asdfe45we45w345wegw345werjktjwertkj';
const PORT = process.env.PORT || 4000;

// Middleware setup
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
  methods: ["POST", "GET", "PUT", "DELETE"]
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Utility function to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided!' });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Routes
app.get('/test', (req, res) => {
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userDoc = await User.create({ username, password: hashedPassword });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json('wrong credentials');
    }

    const passOk = await bcrypt.compare(password, userDoc.password);
    if (!passOk) {
      return res.status(400).json('wrong credentials');
    }

    const token = jwt.sign({ username, id: userDoc._id }, secret, {});
    res.cookie('token', token, { httpOnly: true }).json({ id: userDoc._id, username });
  } catch (e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
});

app.get('/profile', verifyToken, (req, res) => {
  res.json({ id: req.userId });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), verifyToken, async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = `${path}.${ext}`;
  fs.renameSync(path, newPath);

  const { title, summary, content } = req.body;
  const postDoc = await Post.create({
    title,
    summary,
    content,
    cover: newPath,
    author: req.userId,
  });
  res.json(postDoc);
});

app.put('/post', uploadMiddleware.single('file'), verifyToken, async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);
  }

  const { id, title, summary, content } = req.body;
  try {
    const postDoc = await Post.findById(id);
    if (!postDoc) {
      return res.status(404).json('Post not found');
    }
    if (String(postDoc.author) !== String(req.userId)) {
      return res.status(403).json('You are not the author');
    }
    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    postDoc.cover = newPath ? newPath : postDoc.cover;
    await postDoc.save();
    res.json(postDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal server error');
  }
});

app.get('/post', async (req, res) => {
  const posts = await Post.find()
    .populate('author', ['username'])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
});

app.delete('/post/:id', verifyToken, async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (String(post.author) !== String(req.userId)) {
      return res.status(403).json({ error: 'You are not authorized to delete this post' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
    console.log("App connected to database");
  })
  .catch((error) => {
    console.log(error);
  });
