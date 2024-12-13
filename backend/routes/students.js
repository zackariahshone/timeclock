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

router.delete('/deletestudents', async (req, res) => {
  await Student.deleteMany({})
  res.json('success')
})
router.post('/studenttimeclock', async (req, res) => {
  try {
    const studentHistoryID = req.body.student.id;
    console.log(req.body.student.programs[req.body.program])
    const historyData = {
      status: req.body.student.programs[req.body.program] == 'in' ? 'out' : 'in',
      timeMilli: req.body.timeMilli,
      time: req.body.time,
      setBy: req.body.setBy
    }
    let studentHistory = await History.findOne({ id: studentHistoryID });
    let studentToUpdate = await Student.findOne({id:studentHistoryID})
    if (!studentHistory) {
      await History.create({ id: studentHistoryID, [req.body.program]: [historyData] });
      studentToUpdate.programs[req.body.program] = historyData.status;

      await Student.findOneAndUpdate({ id: studentHistoryID }, { programs: { ...studentToUpdate?.programs, [req.body.program]: historyData.status } });
      res.json(req.body)
    }
    else {
      studentHistory[req.body.program].push(historyData);
      studentHistory[req.body.program] = [...studentHistory[req.body.program]]
      await History.findOneAndUpdate({ id: studentHistoryID }, { [req.body.program]: studentHistory[req.body.program] })
      studentToUpdate.programs[req.body.program] = historyData.status;
      await Student.findOneAndUpdate({ id: studentHistoryID }, { programs: { ...studentToUpdate?.programs, [req.body.program]: historyData.status } });
      res.json({ id: studentHistoryID, ...historyData })
    }
  } catch (e) {
    res.send({ status: 'err', "message": e })
  }
})

router.get('/getStudentHistory', async (req, res) => {
  const allStudentHistory = await History.find({});
  res.json({ ...allStudentHistory });
})
/**
 * Edit User
 */
router.put('/updatedstudent', async (req, res) => {
  try {
    const id = req.body.id
    const status = req.body.status
    const studentToUpdate = await Student.findOneAndUpdate({ id: id }, { status });
    res.json(studentToUpdate)
  } catch (e) {
    res.json(e);
  }
})


router.post('/updatestudentrecord', async (req, res) => {
// console.log(req.body);
//
  const { id, milliIndex, recordChanges,program } = req.body;

  const newMilli = new Date(`${recordChanges.date} ${recordChanges.time}`).getTime()
  const newTime = new Date(newMilli);
  const studentHistoryToUpdate = await History.findOne({ id })
  // console.log(studentHistoryToUpdate);

  let index = 0;
  studentHistoryToUpdate[program]?.find((doc, x) => {
    if (doc.timeMilli == milliIndex) {
      index = x;
      return true;
    }
  })
  console.log(index)
  console.log(studentHistoryToUpdate[program]);
  console.log(studentHistoryToUpdate[program][index]);

  
  studentHistoryToUpdate[program][index] = {
    ...studentHistoryToUpdate[program][index],
    "timeMilli": newMilli,
    "time": `${newTime.getHours()}: ${newTime.getMinutes()}`
  }
  studentHistoryToUpdate[program] = studentHistoryToUpdate[program].sort((a, b) => a.timeMilli - b.timeMilli)

  await studentHistoryToUpdate.save()
  const allStudentHistory = await History.find({});
  res.json({ ...allStudentHistory });
})

router.delete('/deleteallhistory', async (req, res) => {
  const result = await History.deleteMany({});
  res.send(result);
})
module.exports = router;