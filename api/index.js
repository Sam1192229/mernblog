const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./model/User');
const Post = require('./model/Post');
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer= require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const app = express();
const fs= require('fs')

const saltRounds = 10; // Number of salt rounds for bcrypt
const secret = 'asdfe45we45w345wegw345werjktjwertkj';


//for login
app.use(cors({
  credentials: true,
  origin: '*'
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

const PORT=4000;

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Generate hashed password
        const userDoc = await User.create({
            username,
            password: hashedPassword, // Store hashed password in database
        });
        res.json(userDoc);
    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
});

app.post('/login', async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });
});
app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});



app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,
    });
    res.json(postDoc);
  });

});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    try {
      const postDoc = await Post.findById(id);
      if (!postDoc) {
        return res.status(404).json('Post not found');
      }
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('You are not the author');
      }
      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;
      postDoc.cover = newPath ? newPath : postDoc.cover;
      await postDoc.save(); // Save the updated document
      res.json(postDoc);
    } catch (error) {
      console.error(error);
      res.status(500).json('Internal server error');
    }
  });
});


app.get('/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

app.delete('/post/:id', async (req, res) => {
  const postId = req.params.id;
  const { token } = req.cookies;

  // Verify the token to get user information
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Find the post by ID
      const post = await Post.findById(postId);

      // If post doesn't exist, return 404
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Check if the user is the author of the post
      if (String(post.author) !== String(info.id)) {
        return res.status(403).json({ error: 'You are not authorized to delete this post' });
      }

      // Delete the post
      await post.deleteOne();

      // Return success message
      return res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`App is listening to port : ${PORT}`);
        });
        console.log("app connected to database");
    })
    .catch((error) => {
        console.log(error);
    });
