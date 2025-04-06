import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './TranscriptPage.css';
import Header from '../Header/Header';
import jsPDF from 'jspdf';

function TranscriptPage() {
  const location = useLocation();
  const uploadedFile = location.state?.fileName;
  const audioSrc = uploadedFile ? `http://localhost:4000/media/audio/${uploadedFile}` : '/sample-audio.mp3';
  console.log("📢 audioSrc:", audioSrc);

  const ticketNumber = '123456';
  const customerName = 'John Doe';
  const contactNumber = '+1 (555) 123-4567';

  const [utterances, setUtterances] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const utteranceRefs = useRef([]);

  const transcriptId = location.state?.transcriptId;
  
  const transcriptText = ''; // placeholder since we're using utterances now

  useEffect(() => {
    if (!transcriptId) return;
    fetch(`http://localhost:4000/api/transcribe/transcribe/result/${transcriptId}`)
      .then(res => res.json())
      .then(data => {
        setUtterances(data.utterances || []);
      });
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
  
    const textLines = doc.splitTextToSize(transcriptText, doc.internal.pageSize.width - margin * 2);
    let y = margin;
  
    // Add heading
    doc.setFontSize(14);
    doc.text(`Transcript - Ticket #${ticketNumber}`, margin, y);
    y += 30;
  
    // Add transcript body
    textLines.forEach((line) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
  
    doc.save('transcript.pdf');
  };
  
  return (
    <div>
      <Header />
      <div className="transcript-page">
      <div className="info-bar">
        <span><strong>Ticket #:</strong> {ticketNumber}</span>
        <span><strong>Name:</strong> {customerName}</span>
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

          <div className="transcript-container">
            {utterances.map((utt, index) => {
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
            </div>
          </div>
          <div className="summary-heading">Summary</div>
        </div>
    </div>
    </div>
  </div>
  );
}
export default TranscriptPage;
