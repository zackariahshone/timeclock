const router = require('express').Router();
const studentHistory = require('../dbconnection/models/History')


router.post('/addhistory', async (req, res) => {  
    res.json({status:200})
});

router.post('/edithistory', async (req, res) => {
});


module.exports = router;