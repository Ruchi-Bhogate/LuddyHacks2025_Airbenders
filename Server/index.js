require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const transcribeRoute = require("./routes/transcribe");
app.use("/api/transcribe", transcribeRoute); // ✅ mounts the /test route

app.listen(5000, '127.0.0.1', () => console.log("Server started on 127.0.0.1:5000"));