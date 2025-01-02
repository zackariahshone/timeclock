const express = require('express');
const autoClockout = require('./cron-jobs/autoClockOut')
const app = express();
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const cron = require('node-cron');
require('./dbconnection/connection');


const PORT = process.env.PORT || 5000;
app.use(bodyParser.json())
// app.use(autoClockout)
app.use(routes);
app.use(express.static(path.join(__dirname, '../client', 'build')));   
  // Schedule a cron job to run at 3 PM daily
  
  
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
});
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
    
    cron.schedule('00 23 * * *', () => {
        console.log('Running the MongoDB connection job at 3 PM...');
        autoClockout();
    }); 