const { Router } = require('express');
const { Loans, Payments } = require('../db.js');
const loginRequired = require('../middleware/auth.js');
const logger = require('../logger.js');
const { where } = require('sequelize');

const router = Router();

// GET /
router.get("/", loginRequired, async (req,res)=> {
    try {
        // Returns all matching Loans
        const loans = await Loans.findAll({where: {user_id: req.user.id}});
        return res.status(200).json(loans)
    } catch (e) {
        logger.error(e);
        return res.status(400).json("Something went wrong while retrieving loans")
    }
})

// POST /
router.post("/", loginRequired, async (req,res)=> {
    const { amount, purpose, duration } = req.body;

    if (!amount) {
        return res.status(400).json("Amount is missing")
    }
    // When a Loan is first created there will be no amount paid
    remaining_balance = amount
    total_paid = 0

    if (!purpose) {
        return res.status(400).json("Purpose is missing")
    }
    if (!duration) {
        return res.status(400).json("Duration is missing")
    }

    try{
        // Inserts the Loan
        const newLoan = await Loans.create({user_id: req.user.id, status: "Pending", amount, purpose, duration, remaining_balance, total_paid})
        return res.status(201).json("Loan Successfully created")
    } catch(e) {
        logger.error(e);
        return res.status(400).json("Something went wrong while creating loan")
    }

})

// GET /:id
router.get("/:loan_id", loginRequired, async (req,res)=> {
    const { loan_id } = req.params
    
    try {
        const loan = await Loans.findOne({where: {id: loan_id, user_id: req.user.id}});
        if (!loan) {
            return res.status(404).json("Loan not found")
        }
        return res.status(200).json(loan)
    }
    catch (e) {
        logger.error(e);
        return res.status(400).json("Something went wrong while retrieving loan")
    }
})

// PATCH /:id/status
router.patch("/:loan_id/status", loginRequired, async (req,res)=> {
    // Checks if the logged in user is an admin
    if (req.user.role !== "admin") {
        return res.status(403).json("You are not authorized to perform this operation")
    }

    const { loan_id } = req.params

    const { status } = req.body
    if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json("Status is not valid")
    }

    try {
        const loan = await Loans.findOne({where: {id: loan_id}});
        if (!loan) {
            return res.status(404).json("Loan not found")
        }
        loan.status = status
        // Updates Loan's status
        await loan.save()
        return res.status(200).json("Loan status updated")
    } catch (e) {
        logger.error(e);
        return res.status(400).json("Something went wrong while updating loan status");
    }

})

// GET /:id/payments
router.get("/:loan_id/payments", loginRequired, async (req,res)=> {
    const { loan_id } = req.params
    
    try {
        // Matches the payments with the loan_id and user_id
        const payments = await Payments.findAll({where: {
            loan_id: loan_id
        }, include: [{
            model: Loans,
            where: { user_id: req.user.id },
            attributes: [] // Exclude loan attributes from the result
        }]});
        if (!payments.length) {
            return res.status(404).json("Payments not found")
        }
        return res.status(200).json(payments)
    } catch (e) {
        logger.error(e);
        return res.status(400).json("Something went wrong while retrieving loan")
    }

})

module.exports = router;
