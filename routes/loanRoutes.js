const express = require('express');
const router = new express.Router();
const validator = require('validator');



//Model

const LoanModel = require('../model/newLoanReq');

////Create Loan

router.post('/loans', async (req, res) => {
    
      if(!(validator.isEmail(req.body.Email))){
          return res.status(400).json('Please provide a valid email address.');
      }

    const isEmailExist = await LoanModel.findOne({Email : req.body.Email});
    if(isEmailExist){
       res.status(400).json('Provided email exist, please provide another email address')
    }
    
    const newUser = new LoanModel({
        customerName : req.body.customerName,
        phoneNo : req.body.phoneNo,
        Email : req.body.Email,
        loanAmount : req.body.loanAmount,
        status : req.body.status,
        creditScore : req.body.creditScore
    })

    try{
       await newUser.save();
       res.status(201).json('New Loan Request has created.');
    }
    catch(error){
        res.status(400).json('Internal Server Error');
    }

})

////Get Loan by Id


router.get('/loans/:id', async (req, res) => {
     const isLoanExist = await LoanModel.findById({_id : req.params.id});
     if(!isLoanExist){
         return res.status(404).json("Sorry! no loan available for the given Id");
     }
      try{
        res.status(201).json(isLoanExist);
      }catch(error){
         res.status(400).json(error);
      }
     
})

///Get all the loans
//Query String /loans?status=new or approved&loanAmountGreater=value

router.get('/loans', async (req, res) => {
    
    let status = "";
    try{
        if(req.query.status && req.query.loanAmountGreater){
            switch(req.query.status){
               case 'new' : 
               status = 'New';
               break;
               case 'approved' :
               status = 'Approved';
               break;
               default : 
               status = ""
               break;
            }
            const loans = await LoanModel.find({status : status, loanAmount : {$gt : parseInt(req.query.loanAmountGreater)}});
         
            if(!loans){
                res.status(404).json('No loans available to show.')
            }
           res.status(200).json(loans); 
         }
         else if(req.query.status){
            switch(req.query.status){
                case 'new' : 
                status = 'New';
                break;
                case 'approved' :
                status = 'Approved';
                break;
                default : 
                status = ""
                break;
             }
             const loans = await LoanModel.find({status : status});
          
             if(!loans){
                 res.status(404).json('No loans available to show.')
             }
            res.status(200).json(loans);
         }

         else{
            const loans = await LoanModel.find({});
            if(!loans){
                res.status(404).json('No loans available to show.')
            }
           res.status(200).json(loans);
         }

    }
    catch(error){
        res.status(400).json(error);
    }
})

///Pagination 

router.get('/loans', async (req, res) => {

    try{
        if(req.query.page && req.query.limit){
            const page= parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const loans = await LoanModel.find({});
            if(!loans){
                return res.status(404).json('No Loans Available');
            }
            let slicedLoans = loans.slice(startIndex, endIndex);
             res.status(200).json(slicedLoans);
        }else{
            const loans = await LoanModel.find({});
            if(!loans){
                res.status(404).json('No loans available to show.')
            }
           res.status(200).json(loans);
        }

        

    }catch(error){
        res.status(400).json(error);
    }
})


/////Delete Loan By id
router.delete('/loans/:id', async (req, res) => {
    const isLoanExist = await LoanModel.findById({_id : req.params.id});
    if(!isLoanExist){
        return res.status(404).json('Sorry no loans to delete.');
    }
    try{
       isLoanExist.status = "Cancelled";
       await isLoanExist.save();
       res.status(201).json('Loan has deleted.');
         
    }catch(error){
        res.status(400).json('Internal server error.')
    }
    

})

////Update Loan 


router.patch('/loans/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['status'];
    const isValidUpdate = updates.every( update => allowedUpdates.includes(update));

    if(!isValidUpdate){
        return res.status(400).json('You are not allowed to changed that field.');
    }
    try{
       const isLoanExist = await LoanModel.findOne({_id : req.params.id});
       if(!isLoanExist){
           return res.status(404).json('');
       }
      updates.forEach( update => isLoanExist[update] = req.body[update]);
      await isLoanExist.save();
      res.status(201).json(isLoanExist);

    }catch(error){
        res.status(400).json(error);
    }
})




module.exports = router;