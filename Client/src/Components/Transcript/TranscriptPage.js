import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap'; // You can install react-bootstrap for tabs
import './TranscriptPage.css';

function TranscriptPage() {
  const [key, setKey] = useState('full-transcript'); // Default tab

  const dummyTranscript = `
    Customer: Hi, I need help with my recent purchase.
    Helper: Sure, I'd be happy to assist you. What seems to be the problem?
    Customer: The product I received was damaged.
    Helper: Oh, that's unfortunate. Could you describe the issue?
    Customer: Yes, the screen is cracked.
    Helper: I see. We can help you with a return or exchange.
    Customer: I'd prefer an exchange, please.
    Helper: Noted. I will process the exchange for you right away.
    Customer: Thank you so much for your help!
    Helper: You're welcome. Have a great day!
  `;

  const dummySummary = "The customer reported receiving a damaged product. The screen was cracked, and the customer preferred an exchange. The helper processed the exchange immediately.";

  const dummyComplaints = ["Cracked screen", "Received wrong product"];
  const dummyToDoList = ["Process the exchange", "Follow-up on the delivery date", "Update the customer status"];

  return (
    <div className="transcript-container">
      <div className="transcript-header">
        <h2>Ticket #12345</h2>
        <p><strong>Customer Name:</strong> John Doe</p>
        <p><strong>Contact Number:</strong> +1 234 567 890</p>
      </div>

      <Tabs id="transcript-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="conversation" title="Conversation Transcript">
          <div className="tab-content">
            <p><strong>Customer:</strong> Hi, I need help with my recent purchase.</p>
            <p><strong>Helper:</strong> Sure, I'd be happy to assist you. What seems to be the problem?</p>
            {/* You can continue to break down the conversation in this format */}
          </div>
        </Tab>
        <Tab eventKey="summary" title="Summary">
          <div className="tab-content">
            <p>{dummySummary}</p>
          </div>
        </Tab>
        <Tab eventKey="complaints" title="Complaints, Requests & Concerns">
          <div className="tab-content">
            <ul>
              {dummyComplaints.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </Tab>
        <Tab eventKey="todo" title="To-Do List">
          <div className="tab-content">
            <ul>
              {dummyToDoList.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default TranscriptPage;
