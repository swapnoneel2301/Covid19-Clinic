const mongoose = require('mongoose');
 
const userSchema = new mongoose.Schema({
   name : {
       type : String,
       required: true
   },
   email : {
    type : String,
    required: true
  },
   phone : {
     type : String,
     required : true
   },
  adhar : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required: true
  },
}, {timestamps:true} );

Corona_user = mongoose.model('Corona_user',userSchema);
module.exports = Corona_user;