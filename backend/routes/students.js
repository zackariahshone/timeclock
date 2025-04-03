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
  const { id, milliIndex, recordChanges,program,status,editedby } = req.body;  
  const newMilli = new Date(`${recordChanges?.date} ${recordChanges?.time}`)?.getTime()
  const newTime = new Date(newMilli);
  const studentHistoryToUpdate = await History.findOne({ id })
  let updates = {}
  if(newMilli){
    updates = {
      "timeMilli": newMilli,
      "time": `${newTime.getHours()}: ${newTime.getMinutes()}`
    }
  }
  status ? updates.status = status : '';
  editedby ? updates.editedby = editedby : '';
  let index = 0;
  studentHistoryToUpdate[program]?.find((doc, x) => {
    if (doc?.timeMilli == milliIndex) {
      index = x;
      return true; 
    }
  })
  
  studentHistoryToUpdate[program][index] = {
    ...studentHistoryToUpdate[program][index],
    ...updates
  }
  studentHistoryToUpdate[program] = studentHistoryToUpdate[program].sort((a, b) => a.timeMilli - b.timeMilli)

  const lastIndex = studentHistoryToUpdate[program].length - 1
  
  const lastStatus = studentHistoryToUpdate[program][lastIndex].status;    
  const studentToUpdate = Student.findOne({id})  
  await studentHistoryToUpdate.save() ;
  await Student.findOneAndUpdate({ id }, { programs: { ...studentToUpdate?.programs, [program]: lastStatus } });
   
  const allStudentHistory = await History.find({});
  res.json({ ...allStudentHistory });
})


router.post('/createstudent', async (req, res) => {  
  try {
    const createdStudent = await Student.create(req.body)
    res.json(createdStudent)
  } catch (e) {
    console.error(e);
  }
});
router.post('/createstudentbulk',async(req,res)=>{
  try{
    const createManyStudents = await Student.insertMany(req.body)
  }catch(e){

  }
  const allStudents = await Student.find({});
  res.send(allStudents)
})
router.post('/studenttimeclock', async (req, res) => {
  try {
    const studentHistoryID = req.body.student.id;
    const historyData = {
      status: req.body.student.programs[req.body.program] == 'in' ? 'out' : 'in',
      timeMilli: req.body.timeMilli,
      time: req.body?.time,
      setBy: req.body.setBy
    }
    if(req.body.earlyClockoutReason){
      historyData['earlyClockoutReason'] = req.body.earlyClockoutReason
    }
    if(req.body.absentReason){
      historyData.status = 'Absent'
      historyData['absentReason'] = req.body.absentReason
    }
    
    let studentHistory = await History.findOne({ id: studentHistoryID });
    let studentToUpdate = await Student.findOne({id:studentHistoryID})
    console.log(studentToUpdate?.programs);
    console.log('change to make', historyData.status);
    
    
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
router.post('/updateitem',async(req, res)=>{
  let requestedUpdates = req.body.updates;
  const itemIndex = req.body.idUpdate
  let programUpdates = {}
  if( 'programs' in req.body.updates){
    const prgkeys = Object.keys(req.body.updates.programs)
    prgkeys.forEach((key)=>{
      if(req.body.updates.programs[key] != "inactive"){
        programUpdates[key] = 'out';
      }
    })
    if(Object.keys(programUpdates).length == 0){
      delete requestedUpdates.programs
    }else{
      requestedUpdates.programs = {...programUpdates}
    } 
  }
  await Student.findOneAndUpdate({id:itemIndex},{...req.body.updates})

  if('id' in req.body.updates){
    await History.findOneAndUpdate({id : itemIndex},{id: req.body.updates.id})   
  }  
  res.json(requestedUpdates);
  
})
router.post('/getstudentstatus', async(req, res) => {
  const id = req.body.id
  const program = req.body.program

  const student = await Student.findOne({id})
    res.json({id, student, program})
})
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


router.post('/deletestudent', async (req, res) => {
  await Student.findOneAndUpdate({ id: req.body.id },{active:false})
  res.json(req.body);
})

router.post('/deletetimestamp',async(req,res)=>{
  const id = req.body.id 
  const program = req.body.program
  const timeId = req.body.timeId
  
  try {
    const document = await History.findOne({ id: id });
    console.log('Matched Document:', document);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const updatedAspire = document[program].filter((item) =>{ 
      return item.timeMilli !== timeId
      }
    );

    const result = await History.updateOne(
      { id: id },
      { $set: { [program]: updatedAspire } }
    );


    if (result.modifiedCount > 0) {
      console.log(updatedAspire);
      
      const lastIndex = updatedAspire.length - 1
      
      const lastStatus = updatedAspire[lastIndex].status;    
      const studentToUpdate = Student.findOne({id})  
      await Student.findOneAndUpdate({ id }, { programs: { ...studentToUpdate?.programs, [program]: lastStatus } });
      
      const udpatedHistory = await History.find({});
      res.status(200).json({...udpatedHistory});
    } else {
      res.status(404).json({ message: 'Record not found or already deleted' });
    }
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'An error occurred' });
  }

})
router.post('/activatestudent', async (req, res) => {
  const updatedStudent = await Student.findOneAndUpdate({ id: req.body.id },{active:req.body.active})
  const dataRefresh = await Student.find({id:req.body.id})
  res.json(dataRefresh);
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