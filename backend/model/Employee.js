const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//monggose

// Define collection and schema
let Employee = new Schema({
  employee_name: {
    type: String
  },
  employee_email: {
    type: String
  },
  section: {
    type: String
  },
  
  subjects: {
    type: Array
  },
  gender: {
    type: String
  },
  doj: {
    type: Date
  },
  

  mobile:
  {
    type:Number
  },
  dept:
  {
    type:String
  },
  empcode:{

    type:String
  },
  sp:
  {
    type:String
  },
  or:
  {
    type:Number
  },
  punc:
  {
    type:Number
  },
  comm:
  {
    type:Number
  },
  tw:
  {
    type:Number
  },
  pd:
  {
    type:Number
  },
  ls:
  {
    type:Number
  },

  

  
}, {
  collection: 'employees'
})

module.exports = mongoose.model('Employee', Employee)