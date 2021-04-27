const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

//passport config
require('./config/passport.js')(passport);

// DB config
const db = require('./config/keys.js').mongoURI;
const PORT = process.env.PORT || 3000;



mongoose.connect(db,{ useNewUrlParser:true , useUnifiedTopology: true })
         .then(()=>{ 
            app.listen(PORT,console.log(`server started on port no ${PORT}`));
             console.log('connected to Database...');
            }).catch(err=>console.log(err));

            
//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//BodyParser
app.use(express.urlencoded({extended:true}));
// app.use(express.bodyParser());

//Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//Routes

app.use('/',require('./routes/index.js'));
app.use('/users',require('./routes/users.js'));

