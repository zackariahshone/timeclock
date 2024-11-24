const router = require('express').Router();
const studentHistory = require('../dbconnection/models/History')


router.post('/addhistory', async (req, res) => {  
    res.json({status:200})
});

router.post('/updatetimeclock', async (req, res) => {
    console.log(req.body)
    const filter = { 
        id:req.body.currentTimeStamp.id , 
        'clockedInOutHistory.timeMilli': req.body.currentTimeStamp.timeMilli // Match the specific entry
      };
      const update = {
        $set: {
          'clockedInOutHistory.$.timeMilli':  req.body.newTimeStamp.newTime, // New timeMilli
          'clockedInOutHistory.$.time': `${new Date(req.body.newTimeStamp.newTime).getHours()} : ${new Date(req.body.newTimeStamp.newTime).getMinutes()}`           // New time
        }
      };
      
    const historyCollection = await studentHistory.findOneAndUpdate(filter,update)   
    console.log(historyCollection);
    // historyToEdit.timeMilli = req.body.newTimeStamp.newTime
    // historyToEdit.time = `${new Date(req.body.newTimeStamp.newTime).getHours()} : ${new Date(req.body.newTimeStamp.newTime).getMinutes()}`
    // await historyCollection.save()
    res.send('200')
});


module.exports = router;