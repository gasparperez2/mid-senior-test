const request = require('supertest');
const app = require('../src/app');
const { sequelize, Users, Payments, Loans } = require('../src/db.js');
const { expect } = require('chai');  // Chai for assertions
const bcrypt = require('bcrypt');
const { where } = require('sequelize');

describe('API Routes', () => {

    before(async () => {
        await Users.destroy({
          where: {},
          truncate: { cascade: true },
        })
        await Payments.destroy({
            where: {},
            truncate: { cascade: true },
        })
        await Loans.destroy({
          where: {},
          truncate: { cascade: true },
        }) 
    });
    
    // Test logged out user
    it('should return a 401 if user is not logged in', (done) => {
        request(app)
            .get('/api/loans')
            .expect(401)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body.message).to.equal('Authorization token is required');
                done();
            });
    });

    // Test register request (error case)
    it('should return an error if name is missing in POST /api/users', (done) => {
        request(app)
            .post('/api/users/register')
            .send({})  // Send an empty payload
            .expect(400)  // Assert status code
            .end((err, res) => {
                expect(err).to.be.null;  // No error
                expect(res.body).to.equal('Name is missing');  // Assert error message
                done();
            });
    });

    // Test register request (success case)
    it('should create a new user on POST /api/users/register', (done) => {
        request(app)
            .post('/api/users/register')
            .send({ name: 'John Doe', email: "john@doe.com", password: "myPassword123" })  // Send request payload
            .expect(201)  // Assert status code
            .end((err, res) => {
                expect(err).to.be.null;  // No error
                expect(res.body.token);  // Assert response message
                done();
            });
    });

    // Test logged in user should create a loan
    it('should create a loan', (done) => {
        request(app)
            .post('/api/loans')
            .set('Authorization', token) // Set Authorization header
            .send({ amount: 200, purpose: "business", duration: 4 })  // Send request payload
            .expect(201)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.equal("Loan Successfully created");
                done();
            });
    });

    // Test should retrieve a list of loans
    var loan_id;
    it('should return a list of loans', (done) => {
        request(app)
            .get('/api/loans')
            .set('Authorization', token) // Set Authorization header
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body.length).to.equal(1);
                expect(res.body[0].total_paid).to.equal(0);
                expect(res.body[0].amount).to.equal(200);
                expect(res.body[0].remaining_balance).to.equal(200);
                expect(res.body[0].duration).to.equal(4);
                expect(res.body[0].purpose).to.equal("business");
                loan_id = res.body[0].id;
                done();
            });
    });

    // Test should not be authorized to update loan status
    it('should not be authorized to update loan status', (done) => {
        request(app)
            .patch(`/api/loans/${loan_id}/status`)
            .set('Authorization', token) // Set Authorization header
            .send({ status: "Approved" })  // Send request payload
            .expect(403)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.equal("You are not authorized to perform this operation");
                done();
            });
    });

    // Create an admin user
    it('should create an admin user', async () => {
        const password_hash = await bcrypt.hash("myPassword123", 10);
        const adminUser = await Users.create({ name: 'Admin user', email: "admin@admin.com", password: password_hash, role: "admin" });
        expect(adminUser).to.not.be.null;
    });

    // Test admin should login
    var admin_token;
    it('should login as admin', (done) => {
        request(app)
            .post('/api/users/login')
            .send({ email: "admin@admin.com", password: "myPassword123" })  // Send request payload
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body.token);  // Assert response message
                admin_token = res.body.token;
                done();
            });
        })
        
    // Test should be authorized to update loan status
    it('should be authorized to update loan status', (done) => {
        request(app)
            .patch(`/api/loans/${loan_id}/status`)
            .set('Authorization', admin_token) // Set Authorization header
            .send({ status: "Approved" })  // Send request payload
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.equal("Loan status updated");
                done();
            });
    });

    // Test should create a payment
    it('should create a payment', (done) => {
        request(app)
            .post('/api/payments')
            .set('Authorization', token) // Set Authorization header
            .send({ amount_paid: 100, loan_id: loan_id })  // Send request payload
            .expect(201)
            .end(async (err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.equal("Payment successfully created");
                // Check for associated Loan
                let Loan = await Loans.findOne({ where: { id: loan_id } })
                expect(Loan.amount).to.equal(200)
                expect(Loan.total_paid).to.equal(100)
                expect(Loan.remaining_balance).to.equal(100)
                expect(Loan.status).to.equal("Approved")
                done();
            });
    });

    after(async () => {
        await Users.destroy({
          where: {},
          truncate: { cascade: true },
        })
        await Payments.destroy({
            where: {},
            truncate: { cascade: true },
        })
        await Loans.destroy({
          where: {},
          truncate: { cascade: true },
        }) 
    });

});
