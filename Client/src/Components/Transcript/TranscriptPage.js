import React, { useState } from 'react';
import './TranscriptPage.css';
import Header from '../Header/Header';
import jsPDF from 'jspdf';

function TranscriptPage() {
  const ticketNumber = '123456';
  const customerName = 'John Doe';
  const contactNumber = '+1 (555) 123-4567';

  const transcriptText = `
    Agent: Hello, thank you for calling support. How can I help you today?
    Customer: Hi, I’ve been facing issues with my internet connection for the last two days.
    Agent: I’m really sorry to hear that. Let me check your account details...
    Customer: Thank you.
    Agent: It seems there was an outage reported in your area. The team is working on it and service should be restored within 24 hours.
    Customer: Oh okay, that’s helpful. Can I get a refund for the days it didn’t work?
    Agent: Absolutely, I’ll process a credit for the affected days.
    Customer: Thanks a lot!
    Agent: You're welcome! Is there anything else I can help you with today?
    Customer: No, that’s all. Have a good day!
    Agent: You too. Goodbye!
  `;

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
            <audio controls>
              <source src="/sample-audio.mp3" type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>

          <div className="transcript-heading">Transcript Conversation</div>

          <div className="transcript-container">
            <pre>{transcriptText}</pre>
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
