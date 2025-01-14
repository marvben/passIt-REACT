require('dotenv').config();

const compression = require('compression');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const routes = require('./routes/routes');
const apis = require('./utils/api/aloc');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// compress all responses. Should be placed before all routes
app.use(compression());
app.use('/', routes);

// Serve static files from the React app and add expire headers
app.use(
  express.static(path.join(__dirname, '../client/build'), {
    maxAge: 86400000,
    setHeaders: function (res, path) {
      res.setHeader(
        'Expires',
        new Date(Date.now() + 2592000000 * 30).toUTCString()
      );
    },
  })
);

// Catch-all route for 404 errors
app.use((req, res) => {
  res.status(404).send('404');
});

// Handle all other requests by returning the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Start the server
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
