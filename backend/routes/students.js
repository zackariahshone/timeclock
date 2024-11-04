const router = require('express').Router();
const Student = require('../dbconnection/models/Students')
const History = require('../dbconnection/models/History')
const StudentBackup = require('../dbconnection/models/StudentBackup');
router.post('/createstudent', async (req, res) => {
  console.log(req.body);
  try {
    const createdStudent = await Student.create(req.body)
    // await StudentBackup.create(req.body);
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
  console.log(req.body.id);
  const result = await Student.findOneAndDelete({ id: req.body.id })
  console.log(result);

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
  console.log(allStudentHistory)
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
    console.log(studentToUpdate);
    res.json(studentToUpdate)
  }catch(e){
    console.log(e);
    
    res.json(e);
  }
  })

router.delete('/deleteallhistory',async(req,res)=>{
  const result = await History.deleteMany({});
  res.send(result);
})
module.exports = router;