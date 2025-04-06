import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const lines = [
  "transcribe with accuracy",
  "summarize with clarity",
  "understand your customers better",
  "manage your tasks",
  "automate tedious tasks effortlessly",
  "enhance customer service interactions",
];



function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentLine, setCurrentLine] = useState(0);

  const navigate = useNavigate();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % lines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    if (email && password) {
      // Simulate successful login
      navigate('/'); // Redirect to home (root route) after login
    } else {
      alert("Please enter valid email and password.");
    }
  };

  return (
    <div className="login-page">
      <div className="left-section">
        <h1 className="product-name">Scribbie</h1>
        <p className="tagline">Supporting You, So You Can Support Them</p>
        <h2 className="static-line">Your AI-powered assistant that can...</h2>
        <motion.div
          key={currentLine}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
          className="animated-line"
        >
          {lines[currentLine]}
        </motion.div>
      </div>

      <div className="right-section">
        <div className="login-box dark">
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Log In</button>
          <p>
            Don’t have an account? <span className="signup-link">Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
