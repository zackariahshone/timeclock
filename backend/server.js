const express = require('express');
const app = express();
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
require('./dbconnection/connection');


const PORT = process.env.PORT || 5000;
app.use(bodyParser.json())
app.use(routes);
app.use(express.static(path.join(__dirname, '../client', 'build'))); 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
