const router = require('express').Router();
const studentHistory = require('../dbconnection/models/History')
const Student = require('../dbconnection/models/Students')

router.post('/addhistory', async (req, res) => {
  res.json({ status: 200 })
});

router.post('/updatetimeclock', async (req, res) => {
  const programToEdit = req.body.program;
  const filter = {
    id: req.body.currentTimeStamp.id,
    [`${programToEdit}.timeMilli`]: req.body.currentTimeStamp.timeMilli // Match the specific entry
  };

  const timeMilliPath = `${programToEdit}.$.timeMilli`;
  const timePath = `${programToEdit}.$.time`;
  const update = {
    $set: {
      [timeMilliPath]: req.body.newTimeStamp.newTime, // New timeMilli
      [timePath]: `${new Date(req.body.newTimeStamp.newTime).getHours()}:${new Date(req.body.newTimeStamp.newTime).getMinutes()}`           // New time
    }
  };

  await studentHistory.findOneAndUpdate(filter, update)
  res.send('200')
});

router.post('/bulkupdatetimeclock', async (req, res) => {
  const changes = req.body.changes
  const program = req.body.program
  const time = req.body.time
  let reduxUpdate = {}
  const timeObj = new Date(time)
  const timeMilitary = `${timeObj.getHours()}:${timeObj.getMinutes()}`
  const studentIDs = Object.keys(changes);
  const inTimeStamp =  {
    "status": "in",
    "timeMilli": time,
    "time": timeMilitary,
    "setBy": req.body.setBy
  }
  const outTimeStamp = {
    ...inTimeStamp,
    'status':'out'
  }
  let update = {}
  const Promises = studentIDs.map(async (id) => {
    const baseHistory = await studentHistory.findOne({ id: id });
    if (changes[id][program] == true) {
      reduxUpdate[id] = 'in';
       update = {
        [`programs.${program}`]: "in", // Add a new program
      }
      await Student.findOneAndUpdate({id:id},{ $set: update })
      const baseHistory = await studentHistory.findOne({ id: id });
      baseHistory[program].push({...inTimeStamp})
      await baseHistory.save()
    }
    else{
      reduxUpdate[id] = 'out';
       update = {
        [`programs.${program}`]: "out", // Add a new program
      }
      await Student.findOneAndUpdate({id:id},{ $set: update })
      baseHistory[program].push({...outTimeStamp})
      await baseHistory.save()
    }
      
  })

  
 const result = await Promise.allSettled(Promises)
 const allFulfilled = result.every((r) => r.status === 'fulfilled');
 if(allFulfilled){
   res.status(allFulfilled ? 200 : 500).send({program,inTimeStamp,reduxUpdate});
  }

})

module.exports = router;