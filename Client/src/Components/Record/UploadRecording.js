// UploadRecording.js
import React, { useState } from 'react';
import './UploadRecording.css'; // Import the CSS

function UploadRecording() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    // Implement the upload logic
    alert(`Uploading recording for ticket #${ticketNumber}`);
  };

  return (
    <div className="upload-recording-container">
      <div className="upload-recording-box">
        <h2>Upload Recording</h2>
        <input
          type="text"
          placeholder="Ticket Number"
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
}

export default UploadRecording;
