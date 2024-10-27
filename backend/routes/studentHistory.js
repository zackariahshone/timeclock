const router = require('express').Router();
const studentHistory = require('../dbconnection/models/History')


router.get('/getstudentHistory',async(req,res)=>{
  console.log(req.body);
  res.send(200)
})
router.post('/addhistory', async (req, res) => {
  console.log(req.body);
  
    res.json({status:200})
});

router.post('/edithistory', async (req, res) => {
  console.log(req.body);
});


module.exports = router;