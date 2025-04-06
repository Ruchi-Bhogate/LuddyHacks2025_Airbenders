import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadRecording.css'; // Import the CSS

function UploadRecording() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file || !ticketNumber || !contactNumber) {
      alert("Please fill in all fields and select a file.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("media", file);
    formData.append("ticketNumber", ticketNumber);
    formData.append("contactNumber", contactNumber);

    try {
      // Step 1: Upload the file
      const uploadResponse = await fetch("http://localhost:4000/api/transcribe/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      // Step 2: Trigger transcription
      const transcribeResponse = await fetch("http://localhost:4000/api/transcribe/transcribe/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName: uploadData.fileName }),
      });

      const transcribeData = await transcribeResponse.json();
      navigate("/transcript", { state: { fileName: uploadData.fileName, transcriptId: transcribeData.transcriptId } });
    } catch (error) {
      console.error("Upload or transcription failed:", error);
      setIsLoading(false);
      alert("Upload or transcription failed.");
    }
  };

  return (
    <div className="upload-recording-container">
      <div className="upload-recording-box">
        {isLoading && (
          <div style={{ marginBottom: '20px' }}>
            <div className="loader"></div>
            <p style={{ color: 'white' }}>Processing your upload...</p>
          </div>
        )}
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
