const router = require('express').Router();
const Student = require('../dbconnection/models/Students')
const History = require('../dbconnection/models/History')
const StudentBackup = require('../dbconnection/models/StudentBackup');

router.get('/getsingledateinsights/:timefilter',async(req,res)=>{
  const filter = Number(req.params.timefilter);
  const filterTwntyFour = filter + 86400000
  const studnetCollection = await Student.find({})
  const programs = ["Richardson Industries","Aspire"]
  let clockedInTotals = {};
  let programTotals = {}
  const studentidProgram = { 
    'all': []
  };
  studnetCollection.forEach((student)=>{
      programs.forEach(prog=>{
        if((prog in student.programs) && (student.admissionDates[prog] < filterTwntyFour) ){
          studentidProgram[prog] == undefined ? studentidProgram[prog] = [student.id] : studentidProgram[prog].push(student.id)
          studentidProgram.all.push(student.id)
          typeof programTotals[prog] != 'number' ? programTotals[prog] = 1 : programTotals[prog] += 1 
        }
      })
  });  
  
  const filteredHistory = await History.find({ id: { $in: studentidProgram.all }});
  filteredHistory.forEach((doc)=>{
    console.log('doc',doc);
    
      programs.forEach(program=>{
        doc[program].find(stamp=>{
          if(stamp.status == 'in' && Number(stamp.timeMilli) >= filter && Number(stamp.timeMilli) <= filterTwntyFour ){
            typeof clockedInTotals[program] != 'number' ? clockedInTotals[program] = 1 : clockedInTotals[program] += 1
            return true; 
          }
        })
      })
  })
  res.json({clockedInTotals, programTotals});
})

router.get('/getStudentHistory', async (req, res) => {
  const allStudentHistory = await History.find({});
  res.json({ ...allStudentHistory });
})

router.get('/getallstudents', async (req, res) => {
  try {
    const allTeachers = await Student.find({})
    res.json(allTeachers)
  } catch (e) {
    res.send(e)
  }
})

router.post('/updatestudentrecord', async (req, res) => {
// console.log(req.body);
//
  const { id, milliIndex, recordChanges,program,status,editedby } = req.body;
  console.log(req.body);
  
  const newMilli = new Date(`${recordChanges.date} ${recordChanges.time}`).getTime()
  const newTime = new Date(newMilli);
  const studentHistoryToUpdate = await History.findOne({ id })
  let updates = {
      "timeMilli": newMilli,
      "time": `${newTime.getHours()}: ${newTime.getMinutes()}`
  }
  status ? updates.status = status : '';
  editedby ? updates.editedby = editedby : '';
  console.log(updates);

  let index = 0;
  studentHistoryToUpdate[program]?.find((doc, x) => {
    if (doc.timeMilli == milliIndex) {
      index = x;
      return true;
    }
  })
  
  studentHistoryToUpdate[program][index] = {
    ...studentHistoryToUpdate[program][index],
    ...updates
  }
  studentHistoryToUpdate[program] = studentHistoryToUpdate[program].sort((a, b) => a.timeMilli - b.timeMilli)

  await studentHistoryToUpdate.save()
  const allStudentHistory = await History.find({});
  res.json({ ...allStudentHistory });
})


router.post('/createstudent', async (req, res) => {
  console.log(req.body);
  
  try {
    await StudentBackup.create(req.body);
    const createdStudent = await Student.create(req.body)
    res.json(createdStudent)
  } catch (e) {
    console.error(e);
  }
});
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


router.delete('/deletestudent', async (req, res) => {
  await Student.findOneAndDelete({ id: req.body.id })
  res.json(req.body);
})

router.delete('/deletestudents', async (req, res) => {
  await Student.deleteMany({})
  res.json('success')
})



router.delete('/deleteallhistory', async (req, res) => {
  const result = await History.deleteMany({});
  res.send(result);
})
module.exports = router;