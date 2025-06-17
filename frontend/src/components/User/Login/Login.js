import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Add this line

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const loginDetails = { email, password };

    try {
      const response = await axios.post('http://localhost:8080/login', loginDetails);
      if (response.data.id) {
        localStorage.setItem('userId', response.data.id);
        alert('Login Successful');
        window.location.href = "/userprofile";
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      alert('Invalid credentials');
      window.location.href = "/login";
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="login-title">LOGIN</h1>
        <form onSubmit={onSubmit} className="login-form">
          <label htmlFor="email">EMAIL</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <label htmlFor="password">PASSWORD</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />

          <button type="submit" className="login-button">LOGIN</button>

          <p className="login-text">
            If Your Don't Have Account <span onClick={() => window.location.href='/'}>Register</span>
          </p>
          <p className="login-text">
            <span onClick={() => window.location.href='/adminlogin'}>Admin</span>
          </p>
        </form>
      </div>
      <div className="login-right"></div>
    </div>
  );
}

export default Login;
