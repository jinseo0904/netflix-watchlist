import express, { response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import cors from 'cors';
import { User } from './models/userModel.js';
import usersRoute from './routes/userRoutes.js';
import watchlistRoute from './routes/watchlistRoutes.js'

// for login APIs
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();

// Middleware for parsing request body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware fror handling CORS policy
app.use(cors());
/*

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    })
);
*/

//generating routes
app.get('/', (request, response) => {
    //console.log(request);
    return response.status(234).send("Welcome to Netflix Watchlist");
});

// user sign-in and authentication
app.use('/users', usersRoute); 

// fetching appropriate user interface
app.use('/watchlist', watchlistRoute); 

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    })