require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");

const app = express();
app.use(express.json());

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
