const router = require('express').Router();
const studentHistory = require('../dbconnection/models/History')


router.post('/addhistory', async (req, res) => {  
    res.json({status:200})
});

router.post('/updatetimeclock', async (req, res) => {
    const programToEdit = req.body.program;
    const filter = { 
        id:req.body.currentTimeStamp.id, 
        [`${programToEdit}.timeMilli`]: req.body.currentTimeStamp.timeMilli // Match the specific entry
      };

      const timeMilliPath = `${programToEdit}.$.timeMilli`;
      const timePath = `${programToEdit}.$.time`;
      const update = {
        $set: {
          [timeMilliPath] :  req.body.newTimeStamp.newTime, // New timeMilli
          [timePath]: `${new Date(req.body.newTimeStamp.newTime).getHours()}:${new Date(req.body.newTimeStamp.newTime).getMinutes()}`           // New time
        }
      };
      
     await studentHistory.findOneAndUpdate(filter,update)   
    res.send('200')
});


module.exports = router;