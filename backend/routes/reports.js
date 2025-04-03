const router = require('express').Router();
const History = require('../dbconnection/models/History')
const Student = require('../dbconnection/models/Students')


router.get('/reports', async (req, res) => {
    const rowHeaders = ['DateIn', 'DateOut', 'TimeIn', 'TimeOut', 'CheckedInBy', 'CheckedOutBy','Client Name','Client Id' ,'TotalHours']
    const valuesInFilter = [rowHeaders];
    const start = req.query?.start
    const end = req.query?.end
    const building = req.query?.building
    const allHistory = await History.find();
    const students = await Student.find();
    let x, y = 0;
        allHistory.map(async (doc) => {
            let row = {}
            const timeClock = doc[building];
            let student = students.find(e=>e.id == doc.id)
            
            if (student?.name && Object.keys(student.programs).includes(building)) {
                timeClock.forEach((time) => {
            
                    if ((Number(time.timeMilli) > Number(start) && Number(time.timeMilli) < Number(end) + (24 * 60 * 60 * 1000))) {

                        if (time.status == 'in') {
                            row.StudentName = student.name
                            row.StudentId = student.id
                            row.DateIn = getDateFromMilli(time.timeMilli)
                            row.TimeIn = convertMilitaryToStandard(time.time)
                            row.CheckedInBy = time.setBy
                            x = time.timeMilli
                        }
                        if (time.status == 'out') {
                            row.DateOut = getDateFromMilli(time.timeMilli)
                            row.TimeOut = convertMilitaryToStandard(time.time)
                            row.CheckedOutBy = time.setBy
                            row.Total = getHoursWorked(x, time.timeMilli)
                            valuesInFilter.push(row)
                            x = null
                            row = {}
                        }
                    }
                })
            }
        })

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
    try{
        if (militaryTime) {
            const [hours, minutes] = militaryTime.split(":").map(Number);
            const ampm = hours >= 12 ? "PM" : "AM";
            const standardHours = hours % 12 || 12;
            const standardTime = `${standardHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
            return standardTime;
        }
    }catch(e){
        return '';
    }
}

function getHoursWorked(milliIn, milliOut) {
    return milliOut !== undefined ? ((Number(milliOut) - Number(milliIn)) / (1000 * 60 * 60)).toFixed(2) : 0;
}
module.exports = router