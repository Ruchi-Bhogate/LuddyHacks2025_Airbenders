import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './LoginPage.css';

const lines = [
  "Transcribe with accuracy",
  "Summarize with clarity",
  "Understand your customers better"
];

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentLine, setCurrentLine] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % lines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    alert(`Logging in with ${email}`);
  };

  return (
    <div className="login-page">
      <div className="left-section">
        <h1 className="product-name">CallMind</h1>
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
