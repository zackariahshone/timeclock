const router = require('express').Router();
const Teacher = require('../dbconnection/models/Staff')

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

router.get('/getallteachers', async (req,res)=>{
  try{
    const allTeachers = await Teacher.find({})
    res.json(allTeachers)
  }catch(e){
    res.send(e)
  }
})

router.delete('/deleteteacher',async (req, res)=>{  
  await Teacher.findOneAndDelete({id:req.body.id})
  res.json(req.body);
})

module.exports = router;