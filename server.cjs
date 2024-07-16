const express = require('express');
const path = require('path');
const app = express();
// const http = require('http');
// const https = require('https');
const fs = require('fs');

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle any other routes by serving the index.html
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server on port 3316
const port = 3371;
// var https_options = {};

//Start uncomment for For staging and comment for production

// https_options = {
//   key: fs.readFileSync('/home/jenkins/SSL/ss.key'),
//   cert: fs.readFileSync('/home/jenkins/SSL/ss.crt'),
// };

// http.createServer(app).listen(port, function () {
//   console.log('Server is running on port :' + port);
// });
app.listen(port, () => {
  console.log('Server is running on port :' + port);
});
