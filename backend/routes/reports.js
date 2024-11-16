const router = require('express').Router();
const History = require('../dbconnection/models/History')
const Student = require('../dbconnection/models/Students')
router.get('/reports', async (req, res) => {
    const valuesInFilter = [];
    const start = req.query?.start
    const end = req.query?.end
    const building = req.query?.building
    const allHistory = await History.find();
    let x, y = 0;
    const historyExec = allHistory.map(async (doc) => {
        let row = {}
        const timeClock = doc?.clockedInOutHistory
        let student = await Student.find({ id: doc.id })
        if (student[0].name && student[0].program == building) {
            timeClock.forEach((time) => {
                console.log(start,end, time.timeMilli);
                console.log(time.timeMilli > start)
                console.log(time.timeMilli < end + (24 * 60 * 60 * 1000))
                if((time.timeMilli > start && time.timeMilli < end + (24 * 60 * 60 * 1000))){

                    if (time.status == 'in') {
                    row.studentName = student[0].name
                    row.studentId = student[0].id
                    row.dateIn = getDateFromMilli(time.timeMilli)
                    row.timeIn = convertMilitaryToStandard(time.time)
                    row.checkedInBy = time.setBy
                    x = time.timeMilli
                }
                if (time.status == 'out') {
                    row.dateOut = getDateFromMilli(time.timeMilli)
                    row.timeOut = convertMilitaryToStandard(time.time)
                    row.checkedOutBy = time.setBy
                    row.totalHours = getHoursWorked(x,time.timeMilli)
                    valuesInFilter.push(row)
                    
                    row = {}
                }
            }
                // console.log(time);
            })
        }
    })
    await Promise.all(historyExec);
    console.log(valuesInFilter);
     res.json(valuesInFilter)
})

function getDateFromMilli(milli) {

    const date = new Date(Number(milli));
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();
    const year = date.getFullYear();

    // Add leading zeros if needed
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedMonth}/${formattedDay}/${year}`;
}

function convertMilitaryToStandard(militaryTime) {
    if (militaryTime) {
        const [hours, minutes] = militaryTime.split(":").map(Number);
        const ampm = hours >= 12 ? "PM" : "AM";
        const standardHours = hours % 12 || 12;
        const standardTime = `${standardHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        return standardTime;
    }
    return '';
}

function getHoursWorked (milliIn, milliOut) {
    return milliOut !== undefined ? ((Number(milliOut) - Number(milliIn)) / (1000 * 60 * 60)).toFixed(2) : 0;
}
module.exports = router