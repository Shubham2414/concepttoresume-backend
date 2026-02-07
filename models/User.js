const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
        },
        provider: {
            type: String,
            enum: ["email", "google"],
            default: "email",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
