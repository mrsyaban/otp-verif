import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    phone: {
        type: String,
        required: [true, "Please provide a phone number"],
        unique: true,
    },
    province: {
        type: String,
        required: [true, "Please provide a province"],
    },
    city: {
        type: String,
        required: [true, "Please provide a city"],
    },
    regency: {
        type: String,
        required: [true, "Please provide a regency"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: Number,
    otpExp: {
        type: Date,
        default: Date.now() + 5 * 60 * 1000, // 5 min,
    },
    reqCount: Number,
})

const User = mongoose.models.usersData|| mongoose.model("usersData", usersSchema);

export default User;