/* jslint node: true */
'use strict';

const path = require('path');
const express = require('express');

//set up a web server
const app = express();

//serve files
app.use(express.static(path.join(__dirname, '/build/html')));
app.use(express.static(path.join(__dirname, '/build')));
app.use('/images', express.static(path.join(__dirname, '/images')));
// app.get('/', (req, res) => {
// 	res.sendFile('/build/pixel-art.html');
// });
// app.get('/web.js.map', (req, res) => {
// 	res.sendFile(path.join(__dirname, '/build/web.js.map'));
// });

//start the web server
let port = process.env.PORT || 3000;
app.listen(port);
console.log('Server listening on port ' + port + '...');