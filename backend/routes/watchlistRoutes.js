import express from 'express';
import { User } from '../models/userModel.js';
import { Watchlist } from '../models/watchListModel.js';

const router = express.Router();

// route for getting all users
router.get('/', async (request, response) => {
    try {
        const lists = await Watchlist.find({});
        return response.status(200).json(
            {
                count: lists.length,
                data: lists
            }
        );
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// get the watchlist for a single individual
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Watchlist.findOne({ userID: id });
        if (!result) {
            return response.status(404).json({ message: 'User not found' });
        }

        return response.status(200).json(result.shows);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to add a new show to a user's watchlist
router.post('/addShow/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { title, rating, note, thumbnail } = request.body;
        const watched = false;

        // Validate the input
        if (!title) { // Add more validation as needed
            return response.status(400).json({ message: 'Title is required' });
        }

        // Find the watchlist by userID and add the new show
        const updatedWatchlist = await Watchlist.findOneAndUpdate(
            { userID: id}, 
            { $push: { shows: { title, watched, rating, note, thumbnail } } },
            { new: true, runValidators: true } // Options: return the updated document and run schema validators
        );

        if (!updatedWatchlist) {
            return response.status(404).json({ message: 'Watchlist not found for the given userID' });
        }

        return response.status(200).json({
            message: 'Show added successfully',
            updatedWatchlist
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to remove a show from a user's watchlist
router.delete('/removeShow/:userId', async (request, response) => {
    try {
        const { userId } = request.params;
        const { showId } = request.body; // Assuming the title is sent in the body. Adjust as needed.

        // Validate the input
        if (!showId) { // Ensure there's enough information to identify the show to be removed
            return response.status(400).json({ message: 'Show ID is not specified' });
        }

        // Find the watchlist by userID and remove the show
        const updatedWatchlist = await Watchlist.findOneAndUpdate(
            { userID: userId }, 
            { $pull: { shows: { _id: showId } } }, // Adjust the condition as needed to uniquely identify the show
            { new: true } // Return the updated document
        );

        if (!updatedWatchlist) {
            return response.status(404).json({ message: 'Watchlist not found for the given userID or show not found' });
        }

        return response.status(200).json({
            message: 'Show removed successfully',
            updatedWatchlist
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// edit a specific show
router.patch('/editShow/:userId', async (request, response) => {
    try {
        const { userId } = request.params;
        const { showId, newDetails } = request.body; // Assuming the title to identify the show and newDetails contains the updated show details

        // Validate the input
        if (!showId) { // Ensure there's enough information to identify the show and the new details to update
            return response.status(400).json({ message: 'A valid showId is required' });
        }

        // Construct the update object dynamically based on provided newDetails
        let update = {};
        for (const [key, value] of Object.entries(newDetails)) {
            update[`shows.$.${key}`] = value;
        }

        // Find the watchlist by userID and update the specific show
        const updatedWatchlist = await Watchlist.findOneAndUpdate(
            { userID: userId, 'shows._id': showId }, 
            { $set: update },
            { new: true } // Return the modified document
        );

        if (!updatedWatchlist) {
            return response.status(404).json({ message: 'Watchlist or show not found with the given criteria' });
        }

        return response.status(200).json({
            message: 'Show updated successfully',
            updatedWatchlist
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});






export default router;