const { Router } = require('express');
const { Payments, Loans } = require('../db.js');
const loginRequired = require('../middleware/auth.js');
const logger = require('../logger.js');

const router = Router();


// POST /
router.post("/", loginRequired, async (req,res)=> {
    const { amount_paid, loan_id } = req.body;

    if (!amount_paid || amount_paid <= 0) {
        return res.status(400).json("Amount is missing");
    }
    if (!loan_id) {
        return res.status(400).json("Loan ID is missing");
    }

    try{
        const Loan = await Loans.findOne({where: {id: loan_id, user_id: req.user.id}});
        if (!Loan) {
            return res.status(404).json("Loan not found");
        } if (Loan.status !== "Approved") {
            return res.status(400).json("Loan is not approved");
        } if (Loan.remaining_balance < amount_paid) {               // Checks that the amount paid is not greater than the remaining balance
            return res.status(400).json("Amount is greater than remaining balance");
        }

        const newPayment = await Payments.create(
            {amount_paid, loan_id, payment_date: new Date()}
        )
        return res.status(201).json("Payment successfully created");
    } catch(e) {
        logger.error(e);
        return res.status(400).json("Something went wrong while creating payment");
    }
})

module.exports = router;
