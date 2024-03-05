import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { Watchlist } from '../models/watchListModel.js';
import * as dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const saltRounds = 10;

// Route for Registering a new user
router.post('/register', async (request, response) => {
    try {
        if (
            !request.body.firstName ||
            !request.body.lastName ||
            !request.body.email ||
            !request.body.password
        ) {
            return response.status(400).send({
                message: 'Send all required fields: First Name, Last Name, email, password',
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: request.body.email });
        if (existingUser) {
            return response.status(409).send({ // 409 Conflict
                message: 'Email already exists. Please use a different email.',
            });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);

        // object for newly registered user
        const newUser = {
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            password: hashedPassword,
            role: 0,
        };

        const user = await User.create(newUser);

        // Create an empty watchlist for the newly registered user
        await Watchlist.create({ userID: user._id, shows: [] });

        return response.status(201).send(user);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// router for login
router.post('/login', async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email) return response.status(400).send({ message: 'Invalid credentials'});

        // Check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return response.status(404).send({ message: 'User not found' });
        }

        // Compare the submitted password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(401).send({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Payload
            `process.env.JWT_SECRET`, // Secret key, stored in an environment variable
            { expiresIn: '1h' } // Options, e.g., token expiration
        );

        // Send the token to the client
        return response.status(200).json({ message: 'Login successful', token: token });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// route for getting all users
router.get('/', async (request, response) => {
    try {

        const users = await User.find({});
        return response.status(200).json(
            {
                count: users.length,
                data: users
            }
        );
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// router for fetching user Id using email
router.get('/userid', async (request, response) => {
    try {
        // Access email from URL parameters instead of the body
        const { email } = request.query; // Changed from request.body to request.query
        //console.log("Email from query: ", email);
        const user = await User.findOne({ email: email });
        if (!user) {
            return response.status(404).send({ message: 'User not found' });
        }

        return response.status(200).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// route to DELETE a specific user
router.delete('/:id', async (request, response) => {
    try {
        const {id} = request.params;
        const result = await User.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({message: 'User not found'});
        }

        // also delete accompanying watchlist
        const deletedWatchList = await Watchlist.findOneAndDelete({ userID: id });

        if (!deletedWatchList) {
            return response.status(404).send({ message: 'Watchlist not found for the given userID' });
        }

        return response.status(200).send({message: 'User deleted successfully'});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message});
    }
});



export default router;