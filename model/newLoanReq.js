const mongoose = require('mongoose');
const validator = require('validator');


const LoanRequestSchema = new mongoose.Schema({
   customerName : {
       type: String,
       trim: true,
       required: true,
   },
   phoneNo : {
      type: String,
      trim: true,
      required: true,
   },
   Email : {
       type: String,
       unique: true,
       trim: true,
       required: true
   },
   loanAmount : {
       type : Number,
       minlength: 5,
       maxlength : 10,
       trim: true,
       required: true
   },
   status : {
       type: String,
       enum: ['New', 'Approved', 'Rejected', 'Cancelled'],
       default: 'New',
       required: true

   },
   creditScore : {
       type: Number,
       trim : true,
       required: true
   }
  

},{
    timestamps: true
})

const LoanRequest = mongoose.model('LoanRequest', LoanRequestSchema);

module.exports = LoanRequest;