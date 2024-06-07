const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const https = require('https');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://twitter_admin:2Mt6ZqxzcZUFUAGO@cluster0.zvh4bgo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

async function run() {
  try{
    await client.connect();
    const postCollection = client.db('database').collection('posts');
    const userCollection = client.db('database').collection('users');
    const likesCollection = client.db('database').collection('likes');
    const commentsCollection = client.db('database').collection('comments');

    // GET requests
    app.get('/post', async (req, res) => {
        const posts = await postCollection.find().toArray();
        res.send(posts.reverse());
    });

    app.get('/user', async (req, res) =>{
        const user = await userCollection.find().toArray();
        res.send(user);
    })

    app.get('/loggedInUser', async (req, res) => {
        const { email, phoneNumber } = req.query;
        let user;
        if (email) {
            user = await userCollection.find({ email: email }).toArray();
        } else if (phoneNumber) {
            user = await userCollection.find({ phoneNumber: phoneNumber }).toArray();
        } else {
            res.status(400).send("Email or phone number not provided");
            return;
        }
        res.send(user);
    });

    app.get('/userPost', async (req, res) => {
        const { email, phoneNumber } = req.query;
        let posts;
        if (email) {
            posts = await postCollection.find({ email: email }).toArray();
        } else if (phoneNumber) {
            posts = await postCollection.find({ phoneNumber: phoneNumber }).toArray();
        } else {
            res.status(400).send("Email or phone number not provided");
            return;
        }
        res.send(posts.reverse());
    });

    app.get('/post/:id/stats', async (req, res) => {
      try {
        const postId = req.params.id;
        const userId = req.query.userId; // Retrieve user ID from query params
        const likes = await likesCollection.countDocuments({ postId });
        const comments = await commentsCollection.find({ postId }).toArray();
        const userHasLiked = await likesCollection.findOne({ postId, userId });
        
        res.status(200).json({
          likes,
          comments: comments || [],
          userHasLiked: !!userHasLiked,
        });
      } catch (error) {
        console.error('Error fetching post stats:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    
    // POST requests
    app.post('/post', async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      io.emit('newTweet', { username: post.username, post: post.post });
      res.send(result);
    });

    app.post('/like', async (req, res) => {
      try {
        const { postId, userId } = req.body;
        const like = { postId, userId };

        await likesCollection.insertOne({ postId, userId });
        io.emit('newLike');
        res.status(200).send({ message: 'Post liked successfully' });
      } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
      
      app.post('/unlike', async (req, res) => {
        try {
          const { postId, userId } = req.body;
          await likesCollection.deleteOne({ postId, userId });
          io.emit('newLike');
          res.status(200).send({ message: 'Post unliked successfully' });
        } catch (error) {
          console.error('Error unliking post:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
      

      app.post('/comment', async (req, res) => {
        try {
          const { postId, userId, comment } = req.body;
          const newComment = { postId, userId, comment };
          await commentsCollection.insertOne(newComment);
          res.status(200).json({ message: 'Comment added successfully', comment: newComment });
        } catch (error) {
          console.error('Error adding comment:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
    // POST request for reCAPTCHA verification
    app.post('/verify-recaptcha', async (req, res) => {
      const { captchaToken } = req.body;

      try {
          const verificationResponse = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
              params: {
                  secret: RECAPTCHA_SECRET_KEY,
                  response: captchaToken
              },
              httpsAgent: new https.Agent({ rejectUnauthorized: false }) // For development only
          });

          const verificationResult = verificationResponse.data;
          res.json(verificationResult);
      } catch (error) {
          console.error("Error verifying CAPTCHA token:", error);
          res.status(500).json({ error: "Internal server error" });
      }
  });
  

    app.post('/register', async(req, res) =>{
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    // PATCH requests
    app.patch('/userUpdates/:email', async (req, res) => {
        const filter = req.params;
        const profile = req.body;
        const options = {upsert : true};
        const updateDoc = {$set: profile};
        const result = await userCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    })

    app.patch('/userUpdatesByPhone/:phoneNumber', async (req, res) => {
      try {
        const filter = { phoneNumber: req.params.phoneNumber };
        const profile = req.body;
        const options = { upsert: true };
        const updateDoc = { $set: profile };
        const result = await userCollection.updateOne(filter, updateDoc, options);
        res.send(result);
      } catch (error) {
        console.error('Error updating user by phone number:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });


    
  } catch (error){
    console.log(error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from twitter!');
});

app.listen(port, () => {
  console.log(`Twitter listening on port ${port}`);
});