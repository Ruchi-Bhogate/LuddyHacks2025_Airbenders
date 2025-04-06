require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uploadRouter = require("./upload");
const path = require("path");
const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/media/audio", express.static(path.join(__dirname, "audio")));
app.use("/", uploadRouter);

const transcribeRoute = require("./routes/transcribe");
app.use("/api/transcribe", transcribeRoute);// ✅ mounts the /test route
// app.use("/", transcribeRoute);

// app.listen(5000, '127.0.0.1', () => console.log("Server started on 127.0.0.1:5000"));
app.listen(4000, () => console.log("Server started on http://localhost:4000"));