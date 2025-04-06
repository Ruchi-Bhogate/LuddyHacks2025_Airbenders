import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './TranscriptPage.css';
import Header from '../Header/Header';
import jsPDF from 'jspdf';
import TodoList from '../ToDo/TodoList';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';


function TranscriptPage() {
  const location = useLocation();
  const uploadedFile = location.state?.fileName;
  const audioSrc = uploadedFile ? `http://localhost:4000/media/audio/${uploadedFile}` : '/sample-audio.mp3';
  console.log("📢 audioSrc:", audioSrc);

  const ticketNumber = '1053';
  const customerName = 'Aditi Thakkar';
  const contactNumber = '+1 (585) 9810492';

  const [utterances, setUtterances] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const utteranceRefs = useRef([]);

  const transcriptId = location.state?.transcriptId;

  const [status, setStatus] = useState("queued"); 
  
  // const transcriptText = ''; // placeholder since we're using utterances now

  useEffect(() => {
    if (!transcriptId) return;
    // fetch(`http://localhost:4000/api/transcribe/transcribe/result/${transcriptId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setUtterances(data.utterances || []);
    //   });

    // const interval = setInterval(() => {
    //   fetch(`http://localhost:4000/api/transcribe/progress/${transcriptId}`)
    //     .then(res => res.json())
    //     .then(data => {
    //       setUtterances(data.utterances || []);
    //       if (data.status === "completed") {
    //         clearInterval(interval);
    //       }
    //     })
    //     .catch(err => {
    //       console.error("Polling error:", err);
    //     });
    // }, 3000); // poll every 3 seconds
    const interval = setInterval(() => {
      fetch(`http://localhost:4000/api/transcribe/progress/${transcriptId}`)
        .then(res => res.json())
        .then(data => {
          setStatus(data.status);
          setUtterances(data.utterances || []);
          setUtterances((prevUtterances) => {
            // const existingIds = new Set(prevUtterances.map(u => u.start));
            // const newUtterances = (data.utterances || []).filter(u => !existingIds.has(u.start));
            // return [...prevUtterances, ...newUtterances];
            const currentAudioTime = audioRef.current?.currentTime * 1000 || 0;
            const allNew = (data.utterances || []).filter(u => u.start <= currentAudioTime);
            const existingStarts = new Set(prevUtterances.map(u => u.start));
            const newUtterances = allNew.filter(u => !existingStarts.has(u.start));
            return [...prevUtterances, ...newUtterances].sort((a, b) => a.start - b.start);
          });
          if (data.status === "completed") {
            clearInterval(interval);
          }
        })
        .catch(err => {
          console.error("Polling error:", err);
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [transcriptId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime * 1000); // convert to ms
    audio.addEventListener("timeupdate", updateTime);

    return () => audio.removeEventListener("timeupdate", updateTime);
  }, []);

  useEffect(() => {
    const activeIndex = utterances.findIndex(
      (utt) => currentTime >= utt.start && currentTime <= utt.end
    );
    if (activeIndex !== -1 && utteranceRefs.current[activeIndex]) {
      utteranceRefs.current[activeIndex].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentTime, utterances]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });
  
    const margin = 40;
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 20;
  
    // const textLines = doc.splitTextToSize(transcriptText, doc.internal.pageSize.width - margin * 2);
    let y = margin;
  
    // Add heading
    doc.setFontSize(14);
    doc.text(`Transcript - Ticket #${ticketNumber}`, margin, y);
    doc.text(`Transcript Report`, margin, y);
    y += 20;
    doc.setFontSize(12);
    doc.text(`Ticket #: ${ticketNumber}`, margin, y);
    y += 20;
    doc.text(`Customer Name: ${customerName}`, margin, y);
    y += 30;
  
    // // Add transcript body
    // textLines.forEach((line) => {
    //   if (y + lineHeight > pageHeight - margin) {
    //     doc.addPage();
    //     y = margin;
    //   }
    //   doc.text(line, margin, y);
    //   y += lineHeight;
    // });
  

    // Summary Section
    doc.setFontSize(13);
    doc.text("Summary:", margin, y);
    y += 20;
    const summaryText = document.querySelector(".summary-content")?.innerText || '';
    const summaryLines = doc.splitTextToSize(summaryText, doc.internal.pageSize.width - margin * 2);
    summaryLines.forEach(line => {
      if (y + lineHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        });
    // doc.save('transcript.pdf');

    y += 20;

    // Concerns & Requests Section
    doc.setFontSize(13);
    doc.text("Concerns & Requests:", margin, y);
    y += 20;
    const concernsRequestsText = document.querySelector(".concerns-requests-container")?.innerText || '';
    const concernsLines = doc.splitTextToSize(concernsRequestsText, doc.internal.pageSize.width - margin * 2);
    concernsLines.forEach(line => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
    y += 20;

    // To-Do List Section
    doc.setFontSize(13);
    doc.text("To-Do List:", margin, y);
    y += 20;
    const todoItems = document.querySelectorAll(".todo-container li");
    todoItems.forEach(item => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(`• ${item.innerText}`, margin, y);
      y += lineHeight;
    });
    y += 20;

    // Transcript Section
    doc.setFontSize(13);
    doc.text("Transcript:", margin, y);
    y += 20;
    utterances.forEach((utt) => {
      const transcriptLine = `${utt.speaker === "A" ? "Agent" : "Customer"}: ${utt.text}`;
      const lines = doc.splitTextToSize(transcriptLine, doc.internal.pageSize.width - margin * 2);
      lines.forEach(line => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
    });

    doc.save('transcript_report.pdf');

  };

  const csatData = {
    csat_score: 3,
    mood: '😐',
    counts: { positive: 3, neutral: 13, negative: 20 }
  };
  
  const total = csatData.counts.positive + csatData.counts.neutral + csatData.counts.negative;
  const satisfactionPercentage = ((csatData.counts.positive + csatData.counts.neutral) / total) * 100;
  
  const pieChartData = [
    { name: 'Positive', value: csatData.counts.positive },
    { name: 'Neutral', value: csatData.counts.neutral },
    { name: 'Negative', value: csatData.counts.negative }
  ];
  
  const COLORS = ['#2ecc71', '#f1c40f', '#e74c3c'];
  
  return (
    <div>
      <Header />
      <div className="transcript-page">
      <div className="info-bar">
        <span><strong>Ticket #:</strong> {ticketNumber}</span>
        <span><strong>Customer Name:</strong> {customerName}</span>
        <span><strong>Contact:</strong> {contactNumber}</span>
      </div>

      {/* We'll add tabs and content here next */}
      <div className="transcript-body">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="audio-heading">Audio Recording</div>
          <div className="audio-player">
            <audio controls ref={audioRef}>
              <source src={audioSrc} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            {/* Optional: Add a comment about highlighting sync */}
          </div>

          <div className="transcript-heading">Transcript Conversation</div>

          {status !== "completed" && (
            <div className="transcribing-indicator">
              <p>🕐 Transcription in progress... status: {status}</p>
            </div>
          )}

          <div className="transcript-container">
          {utterances
            .filter(utt => utt.start <= currentTime) // 👈 only show up to current time
            .map((utt, index) => {
              const isActive = currentTime >= utt.start && currentTime <= utt.end;
              return (
                <p
                  key={index}
                  ref={(el) => (utteranceRefs.current[index] = el)}
                  className={isActive ? "active-utterance" : ""}
                >
                  <span className={`speaker-label ${utt.speaker}`}>
                    {utt.speaker === "A" ? "🧑‍💼 Agent" : utt.speaker === "B" ? "🧑‍💻 Customer" : utt.speaker}
                  </span> {utt.text}
                </p>
              );
            })}
          </div>

          <a onClick={handleDownloadPDF} className="download-link">
            Download as PDF
          </a>   
      </div>
      <div className="right-panel">
          <div className="summary-heading">Summary</div>
          <div className="summary-container">
            <div className="summary-content">
              The customer reported internet connectivity issues over the past two days. 
              An outage was confirmed in the area, and resolution is expected within 24 hours. 
              A refund has been processed for the downtime. No further concerns were raised.
              The customer reported internet connectivity issues over the past two days. 
              An outage was confirmed in the area, and resolution is expected within 24 hours. 
              A refund has been processed for the downtime. No further concerns were raised.
              The customer reported internet connectivity issues over the past two days. 
              An outage was confirmed in the area, and resolution is expected within 24 hours. 
              A refund has been processed for the downtime. No further concerns were raised.
              The customer reported internet connectivity issues over the past two days. 
              An outage was confirmed in the area, and resolution is expected within 24 hours. 
              A refund has been processed for the downtime. No further concerns were raised.
              The customer reported internet connectivity issues over the past two days. 
              An outage was confirmed in the area, and resolution is expected within 24 hours. 
              A refund has been processed for the downtime. No further concerns were raised.
              The customer reported internet connectivity issues over the past two days. 
              An outage was confirmed in the area, and resolution is expected within 24 hours. 
              A refund has been processed for the downtime. No further concerns were raised.
            </div>
          </div>
          <div className='flex-box'>
            <div className='test'>
            <div className="concerns-requests-heading">Concerns & Requests</div>
            <div className="concerns-requests-container">
              <p><strong>Concerns:</strong> The customer was concerned about the reliability of their internet service.</p>
              <p><strong>Requests:</strong> The customer requested a refund for the downtime.</p>
            </div>
            </div>
            {/* To-Do List Section */}
    <div className='test'>       
    <div className="todo-heading">To-Do List</div>
    <TodoList fromTranscript />
    </div> 
    {/* Customer Satisfaction Section */}
    
      </div>
      <div className='flex-box-satisfaction'>
        <div className='width-100'>
          <div className="satisfaction-heading">Customer Satisfaction</div>
          <div className="satisfaction-container">
            <div className="emoji">
              <span role="img" aria-label="mood">{csatData.mood}</span>
            </div>
            <div className="satisfaction-scale">
              <span>Not Satisfied</span>
              <div className="scale-bar">
              <div className="filled-bar" style={{ width: `${satisfactionPercentage}%` }}></div>
                {console.log(satisfactionPercentage)}
              </div>
              <span>Satisfied</span>
            </div>
          </div>
        </div>
        <div className='width-'>
          <div className="chart-heading">Sentiment Distribution in Conversation</div>
          <div className="pie-chart-block">
            <PieChart width={250} height={250}>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
            </PieChart>
          </div>
        </div> 
      </div>
    </div>
      </div>
    </div>
  </div>
  );
}
export default TranscriptPage;
