const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.ASSEMBLYAI_API_KEY;
const headers = {
  authorization: API_KEY,
  "content-type": "application/json",
};

console.log("AssemblyAI API Key:", API_KEY);

async function uploadAudioToAssemblyAI(pathToFile) {
  const audio = fs.readFileSync(pathToFile);
  const response = await axios.post(
    "https://api.assemblyai.com/v2/upload",
    audio,
    {
      headers: {
        authorization: API_KEY,
        "Transfer-Encoding": "chunked",
      },
    }
  );
  return response.data.upload_url;
}

router.get("/test", async (req, res) => { 
    try {
      const audioPath = path.join(__dirname, "../audio/Ruchi and Aditi 1.mp3");
      console.log("🟡 Step 1: Audio path resolved:", audioPath);
  
      if (!fs.existsSync(audioPath)) {
        console.error("❌ Audio file not found at path:", audioPath);
        return res.status(404).send("Audio file not found");
      }
  
      const audioURL = await uploadAudioToAssemblyAI(audioPath);
      console.log("🟡 Step 2: Audio uploaded. URL:", audioURL);
  
      const response = await axios.post(
        "https://api.assemblyai.com/v2/transcript",
        {
          audio_url: audioURL,
          speaker_labels: true,
          sentiment_analysis: true,
          speakers_expected: 2
        },
        { headers }
      );
      const transcriptId = response.data.id;
      console.log("🟡 Step 3: Transcript request submitted. ID:", transcriptId);
  
      let transcript;
      let polling = true;
      let attempt = 1;
  
      while (polling) {
        console.log(`🕐 Polling attempt #${attempt}...`);
        transcript = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          { headers }
        );
  
        const status = transcript.data.status;
        console.log(`📡 Status: ${status}`);
  
        if (status === "completed") {
          console.log("✅ Transcription completed!");
          polling = false;
          
          const formattedResponse = {
            id: transcript.data.id,
            text: transcript.data.text,
            utterances: transcript.data.utterances || [],
          };

          return res.json(formattedResponse);
        } else if (status === "error") {
          console.error("❌ Transcription failed.");
          polling = false;
          return res.status(500).json({ error: "Transcription failed" });
        }
  
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (err) {
      console.error("💥 Server error caught:", err.message);
      return res.status(500).json({ error: "Unexpected server error", details: err.message });
    }
  });

router.get("/sentiment/:id", async (req, res) => {
  try {
    const transcriptId = req.params.id;
    const response = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, { headers });
    const sentiments = response.data.sentiment_analysis_results || [];

    let score = 0;
    let sentimentCount = { positive: 0, neutral: 0, negative: 0 };

    sentiments.forEach(s => {
      const type = s.sentiment.toLowerCase();
      if (sentimentCount[type] !== undefined) {
        sentimentCount[type]++;
      }
    });

    const total = sentiments.length;
    if (total > 0) {
      score = Math.round(
        ((sentimentCount.positive * 5 + sentimentCount.neutral * 3 + sentimentCount.negative * 1) / (total * 5)) * 5
      );
    }

    let emoji = "😐";
    if (sentimentCount.positive > sentimentCount.negative && sentimentCount.positive > sentimentCount.neutral) emoji = "😊";
    else if (sentimentCount.negative > sentimentCount.positive) emoji = "😞";
    else if (sentimentCount.neutral > sentimentCount.positive && sentimentCount.neutral > sentimentCount.negative) emoji = "😐";

    return res.json({ csat_score: score, mood: emoji, counts: sentimentCount });
  } catch (err) {
    console.error("💥 Error fetching sentiment:", err.message);
    return res.status(500).json({ error: "Failed to fetch sentiment analysis", details: err.message });
  }
});

module.exports = router;
