import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
import { generateCallSummary } from "./routes/analysis.js";

import uploadRouter from "./upload.js";
import transcribeRoute from "./routes/transcribe.js";


const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/media/audio", express.static(path.join(__dirname, "audio")));
// app.use("/", uploadRouter);
app.use("/api/transcribe", uploadRouter);
app.use("/api/transcribe", transcribeRoute); // ✅ mounts the /test route

// app.post("/api/process-transcript", async (req, res) => {
//     try {
//       // The front-end or your transcribe code will send the transcript in req.body
//       // e.g. { transcript: "the text from AssemblyAI" }
//       const { transcript } = req.body;
  
//       // 1) Summaries
//       const summary = await generateCallSummary(transcript);
//       // // 2) Objections
//       // const objections = await extractObjections(transcript);
//       // // 3) Actions
//       // const actionItems = await extractActions(transcript);
  
//       // Return it all
//       return res.json({
//         summary,
//       });
//     } catch (error) {
//       console.error("Error in /api/process-transcript:", error);
//       res.status(500).json({ error: "Failed to process transcript" });
//     }
//   });
app.get("/api/transcribe/sentiment/:transcriptId", async (req, res) => {
  const { transcriptId } = req.params;
  try {
    // Logic to fetch sentiment data based on transcriptId
    const sentimentData = await getSentimentData(transcriptId); // Placeholder for actual data fetching logic
    res.json(sentimentData);
  } catch (error) {
    console.error("Error fetching sentiment data:", error);
    res.status(500).json({ error: "Failed to fetch sentiment data" });
  }
});

app.listen(4000, '127.0.0.1', () => console.log("Server started on 127.0.0.1:4000"));
