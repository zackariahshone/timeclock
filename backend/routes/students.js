const router = require('express').Router();
const Student = require('../dbconnection/models/Students')
const History = require('../dbconnection/models/History')
const StudentBackup = require('../dbconnection/models/StudentBackup');
router.post('/createstudent', async (req, res) => {
  try {
    await StudentBackup.create(req.body);
    const createdStudent = await Student.create(req.body)
    res.json(createdStudent)
  } catch (e) {
    console.error(e);
  }
});

router.get('/getallstudents', async (req, res) => {
  try {
    const allTeachers = await Student.find({})
    res.json(allTeachers)
  } catch (e) {
    res.send(e)
  }
})

router.delete('/deletestudent', async (req, res) => {
  await Student.findOneAndDelete({ id: req.body.id })
  res.json(req.body);
})

router.post('/studenttimeclock', async (req, res) => {
  try {
    const studentHistoryID = req.body.student.id;    
    const historyData ={
      status: req.body.student.status == 'in' ? 'out':'in',
      timeMilli: req.body.timeMilli,
      time: req.body.time,
      setBy: req.body.setBy
    }
    let studentHistory = await History.findOne({ id: studentHistoryID });
    if(!studentHistory){
       await History.create({id:studentHistoryID,clockedInOutHistory:[historyData]});
       await Student.findOneAndUpdate({id:studentHistoryID},{status:historyData.status});
      res.json(req.body)
    }else{
      studentHistory.clockedInOutHistory.push(historyData);
      studentHistory.clockedInOutHistory = [...studentHistory.clockedInOutHistory]
      await History.findOneAndUpdate({id:studentHistoryID},{clockedInOutHistory:studentHistory.clockedInOutHistory})
      await Student.findOneAndUpdate({id:studentHistoryID},{status:historyData.status});
      res.json({id:studentHistoryID,...historyData})
    } 
  } catch (e) {
    res.send({status:'err',"message":e}) 
  }
})
router.get('/getStudentHistory', async (req, res) => {
  const allStudentHistory = await History.find({});
  res.json({ ...allStudentHistory });
})
/**
 * Edit User
 */
router.put('/updatedstudent',async(req, res)=>{
  try{
    const id = req.body.id
    const status = req.body.status
    const studentToUpdate = await Student.findOneAndUpdate({id:id},{status});
    res.json(studentToUpdate)
  }catch(e){    
    res.json(e);
  }
  })


  router.put('/updatestudentrecord',async(req, res)=>{

    const {id,milliIndex,recordChanges} = req.body;
    console.log(id, milliIndex, recordChanges);
    
    const newMilli = new Date(`${recordChanges.date} ${recordChanges.time}`).getTime()
    const newTime = new Date(newMilli);
    const studentHistoryToUpdate = await History.findOne({id})
    // console.log(studentHistoryToUpdate);
    
    let index = 0;
    let recordToUpdate = studentHistoryToUpdate.clockedInOutHistory.find((doc,x)=>{
      if(doc.timeMilli == milliIndex){
        index = x;
        return true; 
      }
    })
    // console.log(studentHistoryToUpdate.clockedInOutHistory[index]);
    console.log(recordToUpdate);
    
    studentHistoryToUpdate.clockedInOutHistory[index] = {
      ...studentHistoryToUpdate.clockedInOutHistory[index],
      "timeMilli": newMilli,
      "time": `${newTime.getHours()}: ${newTime.getMinutes()}`,
    }
    console.log(studentHistoryToUpdate.clockedInOutHistory);
    studentHistoryToUpdate.clockedInOutHistory = studentHistoryToUpdate.clockedInOutHistory.sort((a,b)=>a.timeMilli - b.timeMilli )
    console.log(studentHistoryToUpdate.clockedInOutHistory);

    await studentHistoryToUpdate.save()
    // studentHistoryToUpdate.clockedInOutHistory[index].set()
    const allStudentHistory = await History.find({});
    res.json({ ...allStudentHistory });
  })

router.delete('/deleteallhistory',async(req,res)=>{
  const result = await History.deleteMany({});
  res.send(result);
})
module.exports = router;