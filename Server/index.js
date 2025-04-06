import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { generateCallSummary, extractObjections, extractActions } from "./routes/analysis.js";
import transcribeRoute from "./routes/transcribe.js";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/transcribe", transcribeRoute); // ✅ mounts the /test route

app.post("/api/process-transcript", async (req, res) => {
    try {
      // The front-end or your transcribe code will send the transcript in req.body
      // e.g. { transcript: "the text from AssemblyAI" }
      const { transcript } = req.body;
  
      // 1) Summaries
      const summary = await generateCallSummary(transcript);
      // 2) Objections
      const objections = await extractObjections(transcript);
      // 3) Actions
      const actionItems = await extractActions(transcript);
  
      // Return it all
      return res.json({
        summary,
        objections,
        actionItems
      });
    } catch (error) {
      console.error("Error in /api/process-transcript:", error);
      res.status(500).json({ error: "Failed to process transcript" });
    }
  });
  

app.listen(8080, '127.0.0.1', () => console.log("Server started on 127.0.0.1:8080"));