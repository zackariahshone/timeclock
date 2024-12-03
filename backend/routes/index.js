
const StaffRoutes = require('./staff');
const StudentHistory = require('./studentHistory.js');
const StudentRoutes = require('./students.js');
const Reports = require('./reports.js')
const Preferences = require('./preferences.js')

module.exports = [
    StaffRoutes,
    StudentRoutes,
    StudentHistory,
    Reports,
    Preferences
];