const express = require('express');
const router = express.Router();
const CertificationVerification = require("../models/CertificationVerification")
const ErrorHandler = require("../middlewares/error")

router.get('/', async(req, res, next) => {
    try {
        //fetch all certificate entries from database
        let certverify = await CertificationVerification.find()
        console.log(certverify)
        if (!certverify || certverify.length === 0){
            return next(new ErrorHandler("No certificate holder Found", 404))
        }
        //Send certificate entries as the response

        res.status(200).json({
            success: true,
            count:certverify.length,
            certverify: certverify
        })
    } catch(error){
        //Throw an error to middleware
        console.log('An error found:', error.message)
        return next(new ErrorHandler("Failed to retrieve certificate information", 500))
    }
})

//Get certificate info by certificate code
router.get('/', async(req, res, next) => {
    try{
        const certificate_code = req.params['certificate_code'];
        
        //finding the certificate info by the code
        let certificationverification = await CertificationVerification.findById(certificate_code)

        res.json(certificationverification)

    }catch(err){
        console.log('Error:', err)
        res.status(500).json({message: err.message})
    }
})

router.get('/',async (req,res) => {
    try{
        // const displayName = req
        console.log(req.query);
        // we need to query
         const mongodata = await CertificationVerification.find(req.query)
        // no need of request query   http://localhost:3000/allmongo/data
        //const mongodata = await User.find({category:"Indian&Fusion Wear",sub_category:"Kurtas&Suits"})
        res.status(200).json(mongodata);
    }catch(err){
        console.log(err)
        res.sendStatus(404);
    }
});

//Checking the certificate if it's valid
router.post('/', async(req, res, next) => {
    try{
        console.log('Request received')
        const {intern_name, certificate_code} = req.body;
        console.log('Body parsed')

        if(!intern_name || !issue_date || !certificate_code || !is_valid) {
            return next(new ErrorHandler("Error! Please Fill out the Details", 400));
          }

        const newcertificationverification = await CertificationVerification.create({intern_name, issue_date, certificate_code, is_valid})
        console.log('Certificate entry created successfully')

        //return JSON file if success failed
        if(newcertificationverification.is_valid){
            res.status(201).json({
                status: 'Success',
                message: 'Verified',
                intern_name,
                issue_date
            })
        } else {
            res.json({status: 'Error', message: 'This certificate is invalid'})
        }
    }catch (error) {
        console.log("An error occurred:", error);
    
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map(err => err.message);
          return next(new ErrorHandler(validationErrors.join(', '), 400));
        }
    
        // Handle other errors
        return next(error);
      }

})

module.exports = router;