# 📞 Scribbie: AI-Powered Customer Support Call Analyzer
*Luddy Hacks 2025 Submission by Team Airbenders*

## 🚀 Overview

CallSage is an AI-driven tool that automatically transcribes, summarizes, and analyzes customer support calls to extract valuable insights like customer sentiment, follow-up tasks, objections, and satisfaction levels — all in real-time or after the call.

Whether you're running support, sales, or service teams, CallSage helps you:
- Save time on manual notes
- Track customer concerns
- Identify follow-up actions
- Gauge sentiment and CSAT score
- Export comprehensive PDF reports

---

## 🎯 Use Case

> Designed specifically for **Customer Support and Sales Calls**, CallSage acts like a virtual assistant that listens, understands, and structures your conversations into actionable insights.

---

## 🧠 Features

- 🎙️ Audio upload or recording support (MP3/WAV)
- 📝 Real-time transcription (using AssemblyAI or Whisper)
- 🧾 GPT-powered call summarization (via Mistral)
- ✅ Action item extraction (who does what, by when)
- 😐 Sentiment analysis + CSAT scoring
- 📌 Objection/request/concern tracking
- 📄 Downloadable PDF reports
- 📊 Sentiment pie chart and satisfaction slider
- 🧠 To-Do list auto-generated from conversation

---

## 🛠️ Tech Stack

| Layer        | Tech Used                        |
|--------------|----------------------------------|
| Frontend     | React, Tailwind CSS, Recharts    |
| Backend      | Node.js, Express                 |
| AI & NLP     | AssemblyAI, Mistral, OpenAI (alt)|
| File Handling| Multer, fs                       |
| PDF Export   | jsPDF                            |

---

## 🖥️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/CallSage.git
cd CallSage
