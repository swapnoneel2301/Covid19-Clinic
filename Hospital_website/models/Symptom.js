const mongoose = require('mongoose');
 
const symptomSchema = new mongoose.Schema({
    name : {
        type: String ,
        required : true
    },

    email : {
    type : String,
    required: true
  },

    age : {
     type : Number,
     required : true
   },
  test_details_arr : [ {
    sample_id : String,
    stage : String ,
    result : Boolean,
    date: String,
  }]
}, {timestamps:true} );

Symptom = mongoose.model('Symptom',symptomSchema);
module.exports = Symptom;

//  sample_id : {
  //   type : String,
  //   required : true
  // },
  //  stage : {
  //    type : Number,
  //    required : true
  //  },
  //  result : {
  //      type: Boolean ,
  //      rquired : true
  //  },

  // test_details_arr : {
  //   type : [{
  //     sample_id: {
  //       type:String,
  //       required:true
  //     },
  //     stage: {
  //      type:String,
  //      required:true
  //     },
  //     result:{
  //      type:String,
  //      required:true
  //     }
  //   }],
  //   required : true
  // },
