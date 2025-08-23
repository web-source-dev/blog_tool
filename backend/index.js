const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json({ limit: '25mb' }));
app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}

connectDB();
const blogsRoute = require("./routes/blog");
const writersRoute = require("./routes/writers");
const authRoute = require("./routes/auth");
const socialRoute = require("./routes/social");

app.get("/status", (req, res) => {
    res.send("Server is running");
});

app.use("/api/blogs", blogsRoute);
app.use("/api/writers", writersRoute);
app.use("/api/auth", authRoute);
app.use("/api/social", socialRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});