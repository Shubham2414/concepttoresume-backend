const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
    {
        userId: {
            type: String, // temporary, later ObjectId
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: Object,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Resume", ResumeSchema);
