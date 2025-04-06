import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './Dashboard.css';
import { Link } from 'react-router-dom';

const satisfactionData = [
  { name: 'Satisfied', value: 60 },
  { name: 'Neutral', value: 25 },
  { name: 'Dissatisfied', value: 15 },
];

const COLORS = ['#2ecc71', '#f1c40f', '#e74c3c'];

function DashboardPage() {
  const totalCustomers = 120;

  return (
    <div className="dashboard-container">
      <div className="main-panel">
        <h1 className="dashboard-title">Welcome to CallMind</h1>

        <div className="action-buttons side-by-side">
          <button className="upload-btn">
            <Link to="/upload" style={{ color: 'white', textDecoration: 'none' }}>
              Upload Recording
            </Link>
          </button>
          <button className="live-btn">Start Live Call</button>
        </div>

        <div className="chart-section">
          <h2 className="chart-title">Customer Satisfaction</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={satisfactionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
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

        <div className="stat-box">
          <h2>Total Customers Interacted</h2>
          <p className="customer-count">{totalCustomers}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
