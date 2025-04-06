import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './TranscriptPage.css';
import Header from '../Header/Header';
import jsPDF from 'jspdf';

function capitalizeSentence(str) {
  return str
    .split(';')
    .map(part => {
      const trimmed = part.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    })
    .filter(Boolean); // remove empty strings
}

function TranscriptPage() {
  const location = useLocation();
  const uploadedFile = location.state?.fileName;
  const audioSrc = uploadedFile ? `http://localhost:4000/media/audio/${uploadedFile}` : '/sample-audio.mp3';
  console.log("📢 audioSrc:", audioSrc);

  const ticketNumber = '123456';
  const customerName = 'John Doe';
  const contactNumber = '+1 (555) 123-4567';

  const [utterances, setUtterances] = useState([]);
  const [summary, setSummary] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [loadingTranscript, setLoadingTranscript] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);


  const audioRef = useRef(null);
  const utteranceRefs = useRef([]);

  const transcriptId = location.state?.transcriptId;

  useEffect(() => {
    if (!transcriptId) return;
    fetch(`http://localhost:4000/api/transcribe/transcribe/result/${transcriptId}`)
      .then(res => res.json())
      .then(data => {
        setUtterances(data.utterances || []);
        setSummary(data.summary);
        setLoadingTranscript(false);
        setLoadingSummary(false); // ✅ mark summary loaded
      })
      .catch(err => {
        console.error('Error fetching transcript data:', err);
        setLoadingTranscript(false);
        setLoadingSummary(false);
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
  
    const textLines = doc.splitTextToSize(summary?.tldr || 'No summary available.', doc.internal.pageSize.width - margin * 2);
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
  
  return (
    <div>
      <Header />
      <div className="transcript-page">
        <div className="info-bar">
          <span><strong>Ticket #:</strong> {ticketNumber}</span>
          <span><strong>Name:</strong> {customerName}</span>
          <span><strong>Contact:</strong> {contactNumber}</span>
        </div>

        <div className="transcript-body">
          {/* Left Panel */}
          <div className="left-panel">
            <div className="audio-heading">Audio Recording</div>
            <div className="audio-player">
              <audio controls ref={audioRef}>
                <source src={audioSrc} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>

            <div className="transcript-heading">Transcript Conversation</div>
            <div className="transcript-container">
                {loadingTranscript ? (
                  <p>Loading Transcript...</p>
                ) : (
                  utterances.map((utt, index) => {
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
                  })
                )}
              </div>

            <a onClick={handleDownloadPDF} className="download-link">
              Download as PDF
            </a>
          </div>
          {/* Right Panel */}
          <div className="right-panel">
            <div className="summary-heading">Summary</div>
            <div className="summary-container">
              <div className="summary-content">
                {summary && summary.tldr ? summary.tldr : "Loading summary..."}
              </div>
            </div>
            <div className='flex-box'>
              <div className='test'>
              <div className="concerns-requests-heading">Concerns & Requests</div>
<div className="concerns-requests-container">
  {loadingSummary ? (
    <p>Loading...</p>
  ) : (
    <div className="concerns-requests-scrollable">
      {/* Concerns */}
      <div className="concerns-section">
        <h5>Concerns</h5>
        {summary.issue ? (
          <ul>
            {capitalizeSentence(summary.issue).map((concern, index) => (
              <li key={index}>{concern}</li>
            ))}
          </ul>
        ) : (
          <p>No concerns provided.</p>
        )}
      </div>

      {/* Requests */}
      <div className="requests-section">
        <h5>Requests</h5>
        {summary.request ? (
          <ul>
            {capitalizeSentence(summary.request).map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        ) : (
          <p>No requests provided.</p>
        )}
      </div>

      {/* Categories */}
      <div className="categories-tabs">
        <h5>Categories</h5>
        {summary.category ? (
          <div className="tabs">
            {capitalizeSentence(summary.category).map((cat, index) => (
              <button key={index} className="tab-button">
                {cat}
              </button>
            ))}
          </div>
        ) : (
          <p>No categories provided.</p>
        )}
      </div>
    </div>
  )}
</div>


              {/* To-Do List Section */}
              <div className='test'>       
                <div className='todo-heading'>To-Do List</div>
                <div className='todo-container'>
                  <ul>
                    <li>Process refund</li>
                    <li>Follow up with customer</li>
                    <li>Update order status</li>
                  </ul>
                </div>
              </div> 
            </div>
            <div> 
              <div className="satisfaction-heading">Customer Satisfaction</div>
              <div className="satisfaction-container">
                <div className="emoji">
                  <span role="img" aria-label="happy">😊</span>
                </div>
                <div className="satisfaction-scale">
                  <span>Not Satisfied</span>
                  <div className="scale-bar">
                    <div className="filled-bar" style={{ width: '80%' }}></div>
                  </div>
                  <span>Satisfied</span>
                </div>
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
