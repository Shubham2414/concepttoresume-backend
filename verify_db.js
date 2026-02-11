require("dotenv").config();
const mongoose = require("mongoose");
const Resume = require("./models/Resume");

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB...");

        const resume = await Resume.findOne().sort({ createdAt: -1 });

        if (resume) {
            console.log("\n✅ LATEST RESUME FOUND:");
            console.log(JSON.stringify(resume.toObject(), null, 2));
        } else {
            console.log("\n❌ NO RESUMES FOUND.");
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
}

check();
