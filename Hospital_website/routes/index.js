const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Symptom = require('../models/Symptom.js');

let test_no = 0 ;


router.get('/', forwardAuthenticated , (req,res)=>{
    res.render('index.ejs');
});

router.get('/dashboard', ensureAuthenticated , (req, res) => {
 const email = req.user.email;
 Symptom.findOne({email:email}).then((user)=>{
     if(user){
        
        let arr_size = user.test_details_arr.length;
        // console.log(arr_size);
        // console.log(user.test_details_arr[arr_size-1].sample_id);
        console.log(user.test_details_arr[arr_size-1].stage);
        
        res.render('dashboard', {
          user: req.user,
          sample_id : user.test_details_arr[arr_size-1].sample_id,
          stage: user.test_details_arr[arr_size-1].stage,
          result : user.test_details_arr[arr_size-1].result
        });
     }else{
      res.render('dashboard', {
        user: req.user,
        sample_id : undefined
      });

     }
 }) .catch(err => console.log(err));

  
});

router.get('/test', (req,res)=>{
    res.render('test_form.ejs');
});

router.post('/test',(req,res)=>{

  const {age,date,symptom1,symptom2,symptom3,symptom4,symptom5,symptom6,symptom7,symptom8,symptom9} = req.body;

  let test_no_str = test_no.toString();
  if(test_no>=0&&test_no<=9)
   test_no_str = '0'+test_no_str;
  let sample_id = `${date.split('-')[2]}${date.split('-')[1]}${req.user.name.substr(0,2).toUpperCase()}${test_no_str}`;
  test_no = (test_no + 1)%100;

  const name = req.user.name;
  const email = req.user.email;
  const stage = 0;
  const result = false;
  const test_details_arr = [{sample_id,stage,result,date}];

  // const newSymptom = new Symptom({ name , email , age , sample_id , stage , result , date ,test_details_arr });
  // newSymptom.save()
  //          .then(user=>{
  //            console.log(user);
  //            res.redirect('/dashboard');
  //          })
  //          .catch(err=>console.log(err));


   Symptom.findOne({email:email}).then((user)=>{

      // find one user
        if(user){
          user.test_details_arr.push({sample_id,stage,result,date});
          user.save().then(()=>{
            res.redirect('/dashboard');
          }).catch(err=>console.log(err));

        }else{
          // const test_details_arr = [{sample_id,stage,result}];
          // const newSymptom = new Symptom({ name , email , age ,sample_id,stage,result,date,test_details_arr});
          const newSymptom = new Symptom({ name , email , age,test_details_arr});
          newSymptom.save()
           .then(user=>{
             console.log(user);
             res.redirect('/dashboard');
           })
           .catch(err=>console.log(err));
        }

   }).catch(err=>console.log(err));
  
});

router.get('/account',ensureAuthenticated , (req,res)=>{
  let age ;
  let no_covid_test ;
  Symptom.findOne({email:req.user.email})
  .then((user)=>{
    res.render('account.ejs',{user:req.user,age:user.age,no_covid_test:user.test_details_arr.length});
  })
  .catch(err => console.log(err));
  
  
});

router.get('/history',ensureAuthenticated , (req,res)=>{
  Symptom.findOne({email:req.user.email})
  .then((user)=>{
    res.render('history.ejs',{test_details_arr:user.test_details_arr});
    console.log(user.test_details_arr.date);
  }).catch(err=>console.log(err));
  

});

module.exports = router;