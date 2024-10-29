const router = require('express').Router();
const Teacher = require('../dbconnection/models/Staff')

/**
 * Handle Sign up
 */
router.post('/createteacher', async (req, res) => {
  console.log(req.body);
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
  console.log(req.body.id);
  
  // const result = await Student.findOneAndDelete({id:`${req.body.id}`})
  const result = await Teacher.findOneAndDelete({id:req.body.id})
  console.log(result);
  
  res.json(req.body);
})
/**
 * Handle log in 
 */
// router.post('/login', async (req, res) => {
//   const currentUser = await User.find({ email: req.body.email, pwd: req.body.password }).lean();
//   // send tokenized user credential to store on the front end.
//   if (currentUser.length !== 0) {
//     const token = jwt.sign(currentUser[0], '124', { mutatePayload: true });
//     req.session.loginStatus = true;
//     res.send(
//       {
//         ...currentUser[0],
//         token: true,
//         authToken: token
//       });
//   } else {
//     req.session.loginStatus = false;
//     res.send({ token: false });
//   }
// });
/**
 * Edit User
 */
router.post('/editstaff', async (req, res) => {
  const userCred = jwt.decode(req.headers['x-access-token']);
  let itemsToUpdate = UTILS.rmvEmpty(req.body);
  await User.findOneAndUpdate({ email: userCred.email }, itemsToUpdate).lean();
  const updatedUser = await User.findOne({ email: userCred.email }).lean();
  const token = jwt.sign({ ...updatedUser }, '124');
  res.send(
    {
      ...updatedUser,
      token: true,
      authToken: token
    });
});

// router.post('/setFavoriteTrucks',async(req, res)=>{
//   const userCred = jwt.decode(req.headers['x-access-token']);
//   const updatedUser = await User.findOne({ email: userCred.email }).lean();

//   if(!updatedUser.favFoodTrucks.includes(req.body.truckData)){
//     await User.updateOne({ $push: { favFoodTrucks: req.body.truckData}})
//   }else{
//     const refinedList =  updatedUser.favFoodTrucks.filter((truck)=>truck != req.body.truckData);
//     console.log(`refinedList${refinedList}`);
//     debug = await User.findByIdAndUpdate(updatedUser._id, {favFoodTrucks: refinedList})
//   }
// });
module.exports = router;