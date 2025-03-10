const mongoose = require('mongoose');
const prefs = require('../dbconnection/models/Preference')
const Student = require('../dbconnection/models/Students');
const History = require('../dbconnection/models/History')
const cron = require('node-cron');

const mongoURI = 'mongodb://localhost:27017/ercDB';
// const convertToMilitaryTime = 'cron_util.js';
const convertToMilitaryTime = function(time12h) {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = modifier.toUpperCase() === 'AM' ? '00' : '12';
  } else {
    hours = modifier.toUpperCase() === 'PM' ? parseInt(hours, 10) + 12 : hours;
  }

  return `${hours}:${minutes}`;
}
 async function autoClockout() {
      // const tempConnect =  mongoose.createConnection(mongoURI).on("connected");
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
          return;
      // tempConnect.close();
  }
  
  module.exports = async function initAutoClockout()  {

  const autoClockoutTime = await prefs.findOne({id:'autoClockoutTime'})
  console.log(autoClockoutTime);
  
  const timeToClockOut = `${autoClockoutTime.value.time}:00 ${autoClockoutTime.value.timeOfDay}`
  const twentryFourHour = convertToMilitaryTime(timeToClockOut)
  
  console.log(twentryFourHour);
  cron.schedule(`50 14 * * *`, () => {
    console.log('clockout job running');
    autoClockout();
  }); 
}
autoClockout();

  // Schedule a cron job to run at 3 PM daily
