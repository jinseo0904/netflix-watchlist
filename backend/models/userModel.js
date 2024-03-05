import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },

        lastName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            trim: true,
            unique: true,
            required:true,
        },
        password: {
            type: String,
            minlength: 5,
            required: true,
        },
        role: {
            type: Number,
            default: 0, // 0은 일반 유저, 1은 관리자
        },
        token: {
            type: String,
        },
        tokenExp: {
            type: Number,
        },

    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model('User', userSchema);