import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardPage from './Components/Dashboard/Dashboard';
import UploadRecording from './Components/Record/UploadRecording';
import LoginPage from './Components/Login/LoginPage';
import TranscriptPage from './Components/Transcript/TranscriptPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload" element={<UploadRecording />} />
        <Route path="/transcript" element={<TranscriptPage />} />
      </Routes>
    </Router>
  );
}

export default App;
