const mongoose = require('mongoose');
const Student = require('../dbconnection/models/Students');
const History = require('../dbconnection/models/History')
const mongoURI = 'mongodb://localhost:27017/develop';

module.exports = async function autoClockout() {
      const tempConnect =  mongoose.createConnection(mongoURI).on("connected");

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
          })
          
         const PromiseSetTwo = clockoutCollection.map(async student => {
            const studentID = Object.keys(student)[0];
            const checkoutValues = student[studentID];            
            const stuRecord = allHistory.find(record => record.id == studentID)            
            checkoutValues.map((prog) => {            
              stuRecord[prog].push(
                {
                  'status': 'out',
                  'timeMilli': `${currentTimeMilli}`,
                  'time': currentTimeMillitary,
                  'setBy': 'system'
                }
              )
            })
            await History.findOneAndUpdate({id:Object.keys(student)[0]},{...stuRecord}) //stuRecord.save()
          })
      
      
          const result = await Promise.allSettled(PromiseSetOne,PromiseSetTwo);
      
          const allFulfilled = result.every((r) => r.status === 'fulfilled');

      tempConnect.close();
  }
  
  // Schedule a cron job to run at 3 PM daily