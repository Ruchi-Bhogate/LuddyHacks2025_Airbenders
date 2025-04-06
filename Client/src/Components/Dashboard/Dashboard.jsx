import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Header from '../Header/Header';
import './Dashboard.css';

const satisfactionData = [
  { name: 'Satisfied', value: 65 },
  { name: 'Neutral', value: 20 },
  { name: 'Dissatisfied', value: 15 },
];

const COLORS = ['#2ecc71', '#f1c40f', '#e74c3c'];

const fullNames = [
  'Olivia Johnson', 'Liam Smith', 'Emma Williams', 'Noah Brown', 'Ava Jones',
  'Elijah Garcia', 'Sophia Miller', 'Lucas Davis', 'Isabella Rodriguez', 'Mason Martinez',
  'Mia Hernandez', 'James Lopez', 'Amelia Gonzalez', 'Benjamin Wilson', 'Harper Anderson',
  'Ethan Thomas', 'Evelyn Taylor', 'Logan Moore', 'Abigail Jackson', 'Alexander Martin',
  'Emily Lee', 'Jackson Perez', 'Ella Thompson', 'Sebastian White', 'Elizabeth Harris',
  'Aiden Sanchez', 'Camila Clark', 'Matthew Ramirez', 'Luna Lewis', 'Henry Robinson',
  'Chloe Walker', 'Joseph Young', 'Sofia Allen', 'David King', 'Avery Wright',
  'Carter Scott', 'Mila Torres', 'Wyatt Nguyen', 'Scarlett Hill', 'John Green'
];

const dummyTickets = Array.from({ length: 40 }, (_, i) => ({
  ticket: `#100${i + 1}`,
  customer: fullNames[i % fullNames.length]
}));

function DashboardPage() {
  const userName = 'Isha';
  const currentHour = new Date().getHours();
  const [searchTerm, setSearchTerm] = useState('');

  let greeting = 'Good Evening';
  if (currentHour < 12) {
    greeting = 'Good Morning';
  } else if (currentHour < 18) {
    greeting = 'Good Afternoon';
  }

  const filteredTickets = dummyTickets.filter(ticket =>
    ticket.ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Header />
      <div className="greeting-section">
        <h1 className="greeting-text">{greeting}, {userName} 👋</h1>
      </div>

      <div className="layout-container">
        {/* Left Widgets */}
        <div className="right-panel">
          <div className="action-buttons">
            <h2 className="section-title" style={{ textAlign: 'center', width: '100%' }}>Analyse New Customer Call</h2>
            <div className="buttons-group" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <button className="upload-btn">Upload Recording</button>
              <button className="live-btn">Start Live Call</button>
            </div>
          </div>

          <div className="dashboard-widgets">
            <div className="widget-box">
              <h2 className="widget-title">To-Do List</h2>
              <ul className="todo-list">
                <li>Review yesterday's calls</li>
                <li>Prepare summary for ticket #123456</li>
                <li>Follow up with tech support team</li>
              </ul>
            </div>

            <div className="widget-box1">
              <h2 className="widget-title">Overall Customer Satisfaction</h2>
              <PieChart width={250} height={250}>
                <Pie
                  data={satisfactionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>

        {/* Right Panel for Tickets */}
        <div className="ticket-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="ticket-title">Tickets</h2>
            <p className="ticket-subtitle">Calls Analyzed: {filteredTickets.length}</p>
          </div>
          <input
            type="text"
            placeholder="Search by ticket or customer"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="ticket-list">
            {filteredTickets.map((item, index) => (
              <div key={index} className="ticket-row">
                <span>{item.ticket}</span>
                <span>{item.customer}</span>
                <a href="#" className="view-link">View</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
