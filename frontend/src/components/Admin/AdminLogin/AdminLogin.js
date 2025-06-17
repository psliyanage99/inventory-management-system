import React, { useState } from 'react';
import './AdminLogin.css'; // Import the CSS

function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const { username, password } = credentials;

  const onInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (
      (username === 'admin' && password === '123') ||
      (username === 'admin1' && password === '1234')
    ) {
      alert('Login success');
      window.location.href = '/allitems';
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-left">
        <h2 className='admin-login-title'>ADMIN LOGIN</h2>
        <form onSubmit={onSubmit} className='admin-login-form'>
          <label htmlFor="username">USERNAME:</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={onInputChange}
            value={username}
            required
          />

          <label htmlFor="password">PASSWORD:</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={onInputChange}
            value={password}
            required
          />

          <button type="submit" className='admin-login-button'>LOGIN</button>
        </form>
      </div>
      <div className="admin-login-right"></div>
    </div>
  );
}

export default AdminLogin;
