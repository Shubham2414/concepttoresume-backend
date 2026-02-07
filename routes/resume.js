const express = require("express");
const Resume = require("../models/Resume");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const resume = await Resume.create(req.body);
        res.status(201).json(resume);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
