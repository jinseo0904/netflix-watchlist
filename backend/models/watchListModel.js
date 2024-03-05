import mongoose from "mongoose";

// Define the schema for individual shows in the watchlist
const showSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    watched: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 5,
        min: 0,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    },
    note: {
        type: String,
        default: ''
    },
    thumbnail: {
        type: String,
        default: ''
    }
});

const watchListSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    shows: [showSchema]
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

export const Watchlist = mongoose.model('Watchlist', watchListSchema);