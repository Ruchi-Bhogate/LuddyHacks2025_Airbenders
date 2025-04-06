import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './TranscriptPage.css';
import Header from '../Header/Header';
import jsPDF from 'jspdf';
import TodoList from '../ToDo/TodoList';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function capitalizeSentence(str) {
  return str
    .split(';')
    .map(part => {
      const trimmed = part.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    })
    .filter(Boolean); // remove empty strings
}
function capitalizeTaskItems(taskStr) {
  return taskStr
    .split(';')
    .map(item => {
      const trimmed = item.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    })
    .filter(Boolean); // remove empty
}
function TranscriptPage() {
  const location = useLocation();
  const uploadedFile = location.state?.fileName;
  const audioSrc = uploadedFile ? `http://localhost:4000/media/audio/${uploadedFile}` : '/sample-audio.mp3';
  console.log("📢 audioSrc:", audioSrc);

  const ticketNumber = '1053';
  const customerName = 'Aditi Thakkar';
  const contactNumber = '+1 (585) 9810492';

  const [utterances, setUtterances] = useState([]);
  const [summary, setSummary] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const utteranceRefs = useRef([]);
  const [loadingTranscript, setLoadingTranscript] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [sentimentLoading, setSentimentLoading] = useState(true);
const [sentimentData, setSentimentData] = useState(null);


  const transcriptId = location.state?.transcriptId;

  const [status, setStatus] = useState("queued"); 
  
  // const transcriptText = ''; // placeholder since we're using utterances now
  const [csatData, setCsatData] = useState({
    csat_score: 0,
    mood: '😐',
    counts: { positive: 0, neutral: 0, negative: 0 }
  });
  // useEffect(() => {
  //   if (!transcriptId) return;
  //   fetch(`http://localhost:4000/api/transcribe/transcribe/result/${transcriptId}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       setUtterances(data.utterances || []);
  //       setSummary(data.summary);
  //       setLoadingTasks(false);
  //       setLoadingTranscript(false);
  //       setLoadingSummary(false); // ✅ mark summary loaded
  //     })
  //     .catch(err => {
  //       console.error('Error fetching transcript data:', err);
  //       setLoadingTranscript(false);
  //       setLoadingSummary(false);
  //     });
  // }, [transcriptId]);

  useEffect(() => {
  if (!transcriptId) return;

  const interval = setInterval(() => {
    fetch(`http://localhost:4000/api/transcribe/progress/${transcriptId}`)
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);

        setUtterances((prevUtterances) => {
          const currentAudioTime = audioRef.current?.currentTime * 1000 || 0;
          const allNew = (data.utterances || []).filter(u => u.start <= currentAudioTime);
          const existingStarts = new Set(prevUtterances.map(u => u.start));
          const newUtterances = allNew.filter(u => !existingStarts.has(u.start));
          return [...prevUtterances, ...newUtterances].sort((a, b) => a.start - b.start);
        });

        if (data.status === "completed") {
          clearInterval(interval);

          // ✅ Fetch everything once transcription is fully complete
          fetch(`http://localhost:4000/api/transcribe/transcribe/result/${transcriptId}`)
            .then(res => res.json())
            .then(data => {
              setUtterances(data.utterances || []);
              setSummary(data.summary);
              setLoadingTasks(false);
              setLoadingTranscript(false);
              setLoadingSummary(false);
            })
            .catch(err => {
              console.error('Error fetching transcript data:', err);
              setLoadingTranscript(false);
              setLoadingSummary(false);
            });

          fetch(`http://localhost:4000/api/transcribe/sentiment/${transcriptId}`)
            .then(res => res.json())
            .then(data => {
              setCsatData(data);
              setSentimentLoading(false);
            })
            .catch(err => {
              console.error("Sentiment fetch error:", err);
              setSentimentLoading(false);
            });
        }
      })
      .catch(err => {
        console.error("Polling error:", err);
      });
  }, 3000);

  return () => clearInterval(interval);
}, [transcriptId]);
  useEffect(() => {
    if (!transcriptId) return;
   
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

    fetch(`http://localhost:4000/api/transcribe/transcribe/result/${transcriptId}`)
    .then(res => res.json())
    .then(data => {
      setUtterances(data.utterances || []);
      setSummary(data.summary);
      setLoadingTasks(false);
      setLoadingTranscript(false);
      setLoadingSummary(false); // ✅ mark summary loaded
    })
    .catch(err => {
      console.error('Error fetching transcript data:', err);
      setLoadingTranscript(false);
      setLoadingSummary(false);
    });

        // Fetch sentiment data once
        fetch(`http://localhost:4000/api/transcribe/sentiment/${transcriptId}`)
        .then(res => res.json())
        .then(data => {
          setCsatData(data);
        })
        .catch(err => console.error("Sentiment fetch error:", err));
  
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
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  
    const margin = 40;
    const lineHeight = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let y = margin;
  
    const wrapText = (text, maxWidth) =>
      doc.splitTextToSize(text || '', maxWidth);
  
    // Helper to print a section
    const printSection = (title, contentLines) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(title, margin, y);
      y += lineHeight + 4;
  
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      contentLines.forEach(line => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
  
      y += 10; // space between sections
    };
  
    // Section: Header
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(`Transcript Report - Ticket #${ticketNumber}`, margin, y);
    y += 30;
  
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Customer Name: ${customerName}`, margin, y);
    y += lineHeight;
    doc.text(`Contact Number: ${contactNumber}`, margin, y);
    y += 30;
  
    // Section: Transcript
    const transcriptLines = utterances.map(
      (utt) => `${utt.speaker === "A" ? "Agent" : "Customer"}: ${utt.text}`
    );
    printSection('Transcript', wrapText(transcriptLines.join('\n'), pageWidth - 2 * margin));
  
    // Section: Summary
    if (summary?.tldr) {
      printSection('Summary', wrapText(summary.tldr, pageWidth - 2 * margin));
    }
  
    // Section: Concerns
    if (summary?.issue || summary?.request) {
      const concerns = summary.issue?.split(';').map(s => s.trim()).filter(Boolean) || [];
      const requests = summary.request?.split(';').map(s => s.trim()).filter(Boolean) || [];
      const concernLines = [
        'Concerns:',
        ...concerns.map((c) => `- ${c.charAt(0).toUpperCase() + c.slice(1)}`),
        '',
        'Requests:',
        ...requests.map((r) => `- ${r.charAt(0).toUpperCase() + r.slice(1)}`)
      ];
      printSection('Concerns & Requests', concernLines);
    }
  
    // Section: Tasks
    if (summary?.task) {
      const tasks = summary.task.split(';').map(t => t.trim()).filter(Boolean);
      const taskLines = tasks.map((t) => `- ${t.charAt(0).toUpperCase() + t.slice(1)}`);
      printSection('To-Do Tasks', taskLines);
    }
  
    // Section: Satisfaction
    if (sentimentData) {
      const mood = sentimentData.mood || '😐';
      const score = sentimentData.csat_score || 3;
      const satisfaction = `Customer Satisfaction Score: ${score}/5 ${mood}`;
      printSection('Customer Satisfaction', [satisfaction]);
    }
  
    doc.save('Transcript_Report.pdf');
  };

  // const csatData = {
  //   csat_score: 3,
  //   mood: '😐',
  //   counts: { positive: 3, neutral: 13, negative: 20 }
  // };
  const total = csatData.counts.positive + csatData.counts.neutral + csatData.counts.negative;
  const satisfactionPercentage = total > 0 ? ((csatData.counts.positive + csatData.counts.neutral/2) / total) * 100 : 0;

  
  // const satisfactionPercentage = ((csatData.counts.positive + csatData.counts.neutral) / total) * 100;
  
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
            .filter(utt => utt.start <= currentTime) 
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
         
      

             
            
            </div>
            <div className='test'>       
    <div className="todo-heading">To-Do List</div>
    <TodoList
  tasks={
    summary?.task
      ? capitalizeTaskItems(summary.task)
      : []
  }
  loading={loadingTasks}
/>

    </div> 
    
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
