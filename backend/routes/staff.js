const router = require('express').Router();
const Teacher = require('../dbconnection/models/Staff');
const StudentBackup = require('../dbconnection/models/StudentBackup');
const Student = require('../dbconnection/models/Students')
const History = require('../dbconnection/models/History')

/**
 * Handle Sign up
 */
router.post('/createteacher', async (req, res) => {
  try {
    const createdTeacher = await Teacher.create(req.body)
    res.json(createdTeacher)
  } catch (e) {
    console.error(e);
  }
});

router.get('/getallteachers', async (req, res) => {
  try {
    const allTeachers = await Teacher.find({})
    res.json(allTeachers)
  } catch (e) {
    res.send(e)
  }
})

router.post('/activateteacher', async (req, res) => {
  const updatedStudent = await Teacher.findOneAndUpdate({ id: req.body.id }, { active: req.body.active })
  console.log(updatedStudent);

  const dataRefresh = await Teacher.find({ id: req.body.id })
  res.json(dataRefresh);
})

router.delete('/deleteteacher', async (req, res) => {
  await Teacher.findOneAndDelete({ id: req.body.id })
  res.json(req.body);
})

router.get('/clockoutall', async (req, res) => {
  const date = new Date();
  const currentTimeMilli = date.getTime();
  const currentTimeMillitary = `${date.getHours()}:${date.getMinutes()}`
  let allStudents = await Student.find({});
  let allHistory = await History.find({});
  const clockoutCollection = []

   const PromiseSetOne = allStudents.map(async (student) => {
      let clockOutStuPrg = []
        Object.keys(student.programs).map((key)=>{
          
          if (student.programs[key] !== 'out') {
            student.programs[key] = 'out'
            clockOutStuPrg.push(key);
          }
        })
        if(clockOutStuPrg.length > 0){
          clockoutCollection.push({ [student.id]: clockOutStuPrg });
        }
        await Student.findOneAndUpdate({id:student.id},{...student}) //student.save()  
        // Save the document after all updates are made
    })
    // allStudents.save()
    
   const PromiseSetTwo = clockoutCollection.map(async student => {
      const studentID = Object.keys(student)[0];
      const checkoutValues = student[studentID];
      console.log('student',student);
      
      const stuRecord = allHistory.find(record => record.id == studentID)
      // const progs = clockoutCollection[id]
      
      checkoutValues.map((prog) => {
        console.log('prog not defined',prog);
      
        stuRecord[prog].push(
          {
            'status': 'out',
            'timeMilli': `${currentTimeMilli}`,
            'time': currentTimeMillitary,
            'setBy': 'system'
          }
        )
      })
      console.log(stuRecord);
      console.log('87',student);
      
      await History.findOneAndUpdate({id:Object.keys(student)[0]},{...stuRecord}) //stuRecord.save()
    })


    const result = await Promise.allSettled(PromiseSetOne,PromiseSetTwo);

    const allFulfilled = result.every((r) => r.status === 'fulfilled');
    res.status(allFulfilled ? 200 : 500).send(allFulfilled ? '200' : '500');

  // res.send(allStudents)
})

module.exports = router;