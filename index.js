require("dotenv").config();
const express = require("express");
const passport = require("passport");
require("./config/passport");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
const cors = require("cors");
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://concepttoresume.in",
            "https://www.concepttoresume.in",
            "https://concepttoresume-frontend.vercel.app",
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(passport.initialize());

connectDB();

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/resumes", resumeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
