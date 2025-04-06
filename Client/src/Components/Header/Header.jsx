import React from 'react';
import './Header.css';
import { FaUserCircle, FaTachometerAlt, FaPhone } from 'react-icons/fa'; // Icon imports

const Header = () => {
  return (
    <div className="header">
      <div className="left-section1">
        <h1 className="logo">Scribbie</h1>
        <p className="tagline1">Supporting You, So You Can Support Them</p>
      </div>

      <div className="right-section1">
        <button className="dashboard-btn">
          <FaTachometerAlt className="icon" />
          Dashboard
        </button>
        <button className="call-records-btn">
          <FaPhone className="icon" />
          Call Records
        </button>
        <button className="profile-btn">
          <FaUserCircle className="icon" />
          Profile
        </button>
      </div>
    </div>
  );
};

export default Header;
