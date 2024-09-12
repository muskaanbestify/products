const express = require('express');
const router = express.Router();
const CertificationVerification = require("../models/CertificationVerification");
const ErrorHandler = require("../middlewares/error");

// Fetch all certificate entries from the database
router.get('/', async (req, res, next) => {
    try {
        let certverify = await CertificationVerification.find();
        console.log(certverify);
        if (!certverify || certverify.length === 0) {
            return next(new ErrorHandler("No certificate holder found", 404));
        }
        res.status(200).json({
            success: true,
            count: certverify.length,
            certverify: certverify
        });
    } catch (error) {
        console.log('An error occurred:', error.message);
        return next(new ErrorHandler("Failed to retrieve certificate information", 500));
    }
});

// Get certificate info by certificate code
router.get('/:certificate_code', async (req, res, next) => {
    try {
        const certificate_code = req.params['certificate_code'];

        let certificationverification = await CertificationVerification.findById(certificate_code);

        if (!certificationverification) {
            return res.status(404).json({ message: "Certificate not found." });
        }

        res.status(200).json(certificationverification);

    } catch (err) {
        console.log('Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Fetch certificate info based on query parameters
router.get('/search', async (req, res) => {
    try {
        console.log(req.query);
        const mongodata = await CertificationVerification.find(req.query);
        res.status(200).json(mongodata);
    } catch (err) {
        console.log(err);
        res.status(404).send({ message: "Failed to fetch data" });
    }
});

// Verify the certificate
router.post('/', async (req, res, next) => {
    try {
        const { intern_name, certificate_code } = req.body;

        if (!intern_name || !certificate_code) {
            return res.status(400).json({ message: "Error! Please fill out the details." });
        }

        // Find the certificate by certificate_code
        const certificate = await CertificationVerification.findOne({ certificate_code });

        if (!certificate) {
            return res.status(404).json({ message: "Certificate not found." });
        }

        // Verify certificate
        if (certificate.intern_name === intern_name) {
            res.status(200).json({
                status: 'Success',
                message: 'Verified',
                intern_name,
                issue_date: certificate.issue_date
            });
        } else {
            res.status(400).json({ message: 'Invalid certificate details.' });
        }
    } catch (error) {
        console.error("Error during certificate verification:", error);
        res.status(500).json({ message: "Failed to verify certificate. Please try again." });
    }
});

module.exports = router;
