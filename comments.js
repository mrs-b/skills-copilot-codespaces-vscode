// Create web server

const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const { default: axios } = require('axios');
const cors = require('cors');

// Create an instance of express
const app = express();

// Use body parser to parse json
app.use(bodyParser.json());
app.use(cors());

// Create comments variable
const commentsByPostId = {};

// Create route to get comments
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// Create route to post comments
app.post('/posts/:id/comments', async (req, res) => {
  // Create id for comment
  const commentId = randomBytes(4).toString('hex');
  // Get content from body
  const { content } = req.body;
  // Get comments from commentsByPostId
  const comments = commentsByPostId[req.params.id] || [];
  // Add comment to comments
  comments.push({ id: commentId, content, status: 'pending' });
  // Set comments to commentsByPostId
  commentsByPostId[req.params.id] = comments;
  // Emit event to event bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: { id: commentId, content, postId: req.params.id, status: 'pending' },
  });
  // Send a response
  res.status(201).send(comments);
});

// Create route to receive events from event bus
app.post('/events', async (req, res) => {
  // Get type and data from body
  const { type, data } = req.body;
  // Check type
  if (type === 'CommentModerated') {
    // Get comments from commentsByPostId
    const comments = commentsByPostId[data.postId];
    // Find comment
    const comment = comments.find((comment) => comment.id === data.id);
    // Set status of comment
    comment.status = data.status;
    // Emit event to event bus
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data,
    });
  }
  // Send a response
  res.send({});
});

// Listen on