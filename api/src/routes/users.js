const { Router } = require('express');
const { Users } = require('../db.js');
const { validateEmail, generateToken } = require('../utils/utils.js');
const bcrypt = require("bcrypt");
const logger = require('../logger.js');

const router = Router();

// POST /register
router.post("/register", async (req,res)=> {
    const { name, email, password } = req.body;
    
    if (!name) {
        return res.status(400).json("Name is missing")
    } else if (name.length < 4) {
        return res.status(400).json("Name must have at least 4 characters")
    }

    if (!password) {
        return res.status(400).json("Password is missing")
    } else if (password.length < 8) {
        return res.status(400).json("Password must have at least 8 characters")
    }

    if (!email) {
        return res.status(400).json("Email is missing")
    } else if (!validateEmail(email)) {
        return res.status(400).json("Email is invalid")
    } else {
        try {
            // Check if the user is already registered
            const user = await Users.findOne({ where: { email } });
      
            if (user) {
                return res.status(400).send('User is already registered');
            }
        } catch (e) {
            logger.error(e);
            return res.status(400).send('Error occurred while retrieving user');
        }
    }

    try{
        // creates a password hash, inserts the user and generates a token
        const password_hash = await bcrypt.hash(password, 10)
        const newUser = await Users.create({...req.body, role: "user", password: password_hash})
        token = generateToken(newUser)
        return res.status(201).json({token})
    }catch(e) {
        logger.error(e);
        return res.status(400).json("Something went wrong while creating user")
    }
})

// POST /login
router.post("/login", async (req,res)=> {
    const { email, password } = req.body;

    if (!password) {
        return res.status(400).json("Password is missing")
    }
    if (!email) {
        return res.status(400).json("Email is missing")
    } else if (!validateEmail(email)) {
        return res.status(400).json("Email is invalid")
    }
    try {
        // Checks if the user exists
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return res.status(400).send('User not found');
        }
        
        // Compares passwords and returns a token if they match
        const validPass = await bcrypt.compare(password, user.password)
        if (!validPass) {
            return res.status(400).send('Invalid password');
        } else {
            const token = generateToken(user);
            return res.status(200).json({ token });
        }
    } catch (e) {
        logger.error(e);
        return res.status(400).send('Error occurred while retrieving user');
    }
})

module.exports = router;
