// server.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON data in request bodies
app.use(bodyParser.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ message: 'Server is up and running' });
});

app.post('/api/parse', (req, res) => {
  const data = req.body;
  const yelp_url = data.yelp_url;
  res.status(201).json({match:true});
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
