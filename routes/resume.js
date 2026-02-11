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

router.get("/:id", auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!resume) {
            return res.status(404).json({ error: "Resume not found" });
        }

        res.json(resume);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const resume = await Resume.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { title: req.body.title, content: req.body.content },
            { new: true }
        );

        if (!resume) {
            return res.status(404).json({ error: "Resume not found" });
        }

        res.json(resume);
    } catch (err) {
        res.status(400).json({ error: "Update failed" });
    }
});

module.exports = router;
