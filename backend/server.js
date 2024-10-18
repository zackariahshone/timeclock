const express = require('express');
const app = express();
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
require('./dbconnection/connection');

// Define routes and middleware here
// ...

const PORT = process.env.PORT || 5000;
app.use(bodyParser.json())
app.use(routes);
app.use(express.static(path.join(__dirname, '../client', 'build'))); // Assuming your React app is in a 'client' folder

// app.use(express.static(path.join(__dirname, '../client/build')));
// app.use(express.static("../client/build"));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
