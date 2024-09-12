const mongoose = require("mongoose")

const CertificationVerificationSchema = new mongoose.Schema({

    intern_name:{
        type: String,
        required: true
    },
    issue_date:{
        type: String,
        required:true
    },
    certificate_code:{
        type: String,
        required: true
    },
    is_valid:{
        type: Boolean,
        required: true
    },
})

const CertificationVerification = mongoose.model("CertificationVerification", CertificationVerificationSchema);
module.exports = CertificationVerification;