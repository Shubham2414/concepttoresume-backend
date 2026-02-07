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
