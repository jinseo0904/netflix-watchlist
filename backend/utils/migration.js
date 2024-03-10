import mongoose from "mongoose";
import { Watchlist } from '../models/watchListModel.js';
import { PORT, mongoDBURL } from "../config.js";

mongoose
    .connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to update existing documents
const migrateWatchedStatus = async () => {
    const watchlists = await Watchlist.find({});

    for (const list of watchlists) {
        // Map through each show and update the watched field based on its current Boolean value
        list.shows = list.shows.map(show => {
            // Convert the Boolean value to the corresponding new String value
            if (show.watched === true) {
                show.watched = 'watched'; // If it was true
            } else {
                show.watched = 'not watched'; // If it was false or any other value not matching the enum
            }
            return show;
        });

        try {
            await list.save(); // Attempt to save the updated document
        } catch (error) {
            console.error(`Failed to save watchlist for user ${list.userID}:`, error);
            // Handle or log the error as needed
        }
    }

    console.log('Migration completed');
};

migrateWatchedStatus().then(() => mongoose.disconnect());
