const express = require('express');
const router = express.Router();

const passport = require('passport');

const Corona_user = require('../models/User.js');
const { forwardAuthenticated } = require('../config/auth');

router.get('/register', forwardAuthenticated , (req,res)=>{
    res.render('register.ejs');
});

router.get('/login', forwardAuthenticated , (req,res)=>{
    res.render('login.ejs');
});

router.post('/register',(req,res)=>{
    // console.log(req.body);
    // res.send('registration done');
    const {name,email,phone,adhar,password,password2} = req.body;
    let errors = [];
    // checking for name
    if(name[0]!=name[0].toUpperCase())
     errors.push({msg : 'First name must start with capital letter'});
    if(name.length<2)
     errors.push({msg:'Provide Your Full name'});
    // checking for email
    if(!email.includes('@gmail.com')&&!email.includes('@yahoo.com'))
     errors.push({msg:'Email must contain @gmail.com or @yahoo.com'});
    // checking for phone number
    if(phone.toString().length!=10)
     errors.push({msg:'Phone number must contain 10 digit'});
    if(phone.toString()[0]=='0')
     errors.push({msg:'Phone number should not start with 0'});
    // checking for adhar
    if(adhar.toString().length!=12)
     errors.push({msg:'Adhar number must contain 12 digit'});
    // checking for password
    let upcase=0;
    let lowcase=0;
    let digit=0;
    let special=0;
    for(let ch of password)
     {
         if(ch>='A'&&ch<='Z') upcase++;
         else if(ch>='a'&&ch<='z') lowcase++;
         else if(ch>='0'&&ch<='9') digit++;
         else special++;
     }
     if(upcase==0||lowcase==0||digit==0||special==0||password.length<8) 
       errors.push({msg:`password must contain one capital,one small,Numerical value and 
                        a special character and minimum length is 8 characters`}) ;
      
     if(password!=password2)
      errors.push({msg:'confirm the correct passord'});

    
    if(errors.length>0)
    {
        res.render('register.ejs',{
            errors,name,email,phone,adhar,password,password2
        });
    }else{
        // res.send(' Registration done');
        Corona_user.findOne({ email: email }).then(user => {
            if (user) {
              errors.push({ msg: 'Email already exists' });
              res.render('register', {
                errors, name, email, phone, adhar , password, password2});
            } else {
              const newUser = new  Corona_user({
                name,email,phone,adhar,password
              });

              newUser.save()
                     .then( user =>{
                        req.flash(
                            'success_msg',
                            'You are now registered and can log in'
                          );
                          res.redirect('/users/login');
                     }).catch(err=>console.log(err));

            }
        });     
    }
});

router.post('/login', (req, res, next) => {
  passport.authenticate( 'local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res,next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});



module.exports = router;