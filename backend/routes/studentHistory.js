const router = require('express').Router();
const studentHistory = require('../dbconnection/models/History')


router.post('/addhistory', async (req, res) => {  
    res.json({status:200})
});

router.post('/updatetimeclock', async (req, res) => {
    console.log(req.body)
    const historyCollection = await studentHistory.findOne({id:req.body.currentTimeStamp.id})    
    const historyToEdit = historyCollection.clockedInOutHistory.find((doc)=>doc.timeMilli == req.body.currentTimeStamp.timeMilli)
    console.log(historyToEdit);
    historyToEdit.timeMilli = req.body.newTimeStamp.newTime
    historyToEdit.time = `${new Date(req.body.newTimeStamp.newTime).getHours()} : ${new Date(req.body.newTimeStamp.newTime).getMinutes()}`
    console.log(historyToEdit);
    await historyCollection.save()
    res.send('200')
});


module.exports = router;