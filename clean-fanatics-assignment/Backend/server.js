const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bookingRoutes = require("./routes/bookingRoutes");
const providerRoutes = require("./routes/providerRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/cleanfanatics");

app.use("/bookings", bookingRoutes);
app.use("/providers", providerRoutes);
app.use("/admin", adminRoutes);

app.listen(5000, () => console.log("Backend running on port 5000"));
