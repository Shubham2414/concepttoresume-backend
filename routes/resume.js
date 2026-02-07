const express = require("express");
const Resume = require("../models/Resume");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
    try {
        const resume = await Resume.create({
            ...req.body,
            userId: req.userId, // FORCE ownership
        });
        res.status(201).json(resume);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
