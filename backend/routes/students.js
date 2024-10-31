const router = require('express').Router();
const Student = require('../dbconnection/models/Students')
const History = require('../dbconnection/models/History')

router.post('/createstudent', async (req, res) => {
  console.log(req.body);
  try {
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
  console.log(req.body.id);
  const result = await Student.findOneAndDelete({ id: req.body.id })
  console.log(result);

  res.json(req.body);
})

router.post('/studenttimeclock', async (req, res) => {
  try {
    const studentHistoryID = req.body.student.id;
    console.log(req.body);
    
    const historyData ={
      status: req.body.student.status == 'in' ? 'out':'in',
      timeIn: req.body.student.timeIn,
      timeOut: req.body.student.timeIn !== '' ? req.body.student.timeOut : '',
      timeMilli: req.body.timeMilli,
      time: req.body.time,
      setBy: req.body.setBy
    }

    let studentHistory = await History.findOne({ id: studentHistoryID });
    if(!studentHistory){
       await History.create({id:studentHistoryID,clockedInOutHistory:[historyData]});
      res.json(req.body)
    }else{
      studentHistory.clockedInOutHistory.push(historyData);
      studentHistory.clockedInOutHistory = [...studentHistory.clockedInOutHistory]
      await History.findOneAndUpdate({id:studentHistoryID},{clockedInOutHistory:studentHistory.clockedInOutHistory})
      res.json({...req.body})
    }
  } catch (e) {
    res.json(e)
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
router.post('/editstaff', async (req, res) => {
  const userCred = jwt.decode(req.headers['x-access-token']);
  let itemsToUpdate = UTILS.rmvEmpty(req.body);
  await User.findOneAndUpdate({ email: userCred.email }, itemsToUpdate).lean();
  const updatedUser = await User.findOne({ email: userCred.email }).lean();
  const token = jwt.sign({ ...updatedUser }, '124');
  res.send(
    {
      ...updatedUser,
      token: true,
      authToken: token
    });
});

router.delete('/deleteallhistory',async(req,res)=>{
  const result = await History.deleteMany({});
  res.send(result);
})
module.exports = router;