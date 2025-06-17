import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Import CSS

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: '',
  });

  const { fullname, email, password, phone } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.get(`http://localhost:8080/checkEmail?email=${email}`);
    if (response.data) {
      alert("Email already exists");
      window.location.href = "/login";
    } else {
      await axios.post("http://localhost:8080/user", user);
      alert("Registration successful");
      window.location.href = "/login";
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h2 className='register-title'>REGISTER</h2>
        <form onSubmit={onSubmit} className='register-form'>
          <label htmlFor="fullname">FULLNAME</label>
          <input type="text" name="fullname" placeholder="Fullname" value={fullname}
            onChange={(e) => /^[A-Za-z\s]*$/.test(e.target.value) && onInputChange(e)} required />

          <label htmlFor="email">EMAIL</label>
          <input type="email" name="email" placeholder="Email" value={email}
            onChange={onInputChange} required />

          <label htmlFor="PASSWORD">PASSWORD</label>
          <input type="password" name="password" placeholder="Password" value={password}
            onChange={onInputChange} required />

          <label htmlFor="phone">PHONE</label>
          <input type="text" name="phone" placeholder="Phone" value={phone}
            maxLength="10" pattern='[0-9]{10}' title='Enter exactly 10 digits'
            onChange={(e) => /^[0-9\b]{0,10}$/.test(e.target.value) && onInputChange(e)} required />

          <button type="submit" className='register-button'>REGISTER</button>
          <p className='register-text'>If you have an account <span onClick={() => navigate('/login')}>Login</span></p>
          <p className='register-text'>
        <span onClick={() => navigate('/adminlogin')}>Admin</span>
        </p>
        </form>
      </div>
      <div className="login-right"></div>
    </div>
  );
}

export default Register;
