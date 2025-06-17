import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:8080/user/${userId}`)
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching user data');
        setLoading(false);
      });
  }, []);

  const UpdateNavigate = (id) => {
    navigate(`/updateprofile/${id}`);
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/user/${id}`);
        alert("Item deleted successfully");
        window.location.href = "/";
      } catch (error) {
        alert("Error deleting item");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo">USER PROFILE</div>
        <div className="nav-links">
          <span onClick={() => navigate('/home')}>Home</span>
          <span className="active" onClick={() => navigate('/profile')}>Profile</span>
          <span onClick={handleLogout}>Logout</span>
        </div>
      </nav>

      <div className="profile-container">
        {user ? (
          <div className="profile-card">
            <p><strong>Full Name:</strong> {user.fullname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <div className="profile-actions">
              <button className="update-btn" onClick={() => UpdateNavigate(user.id)}>UPDATE</button>
              <button className="delete-btn" onClick={() => deleteUser(user.id)}>DELETE</button>
            </div>
          </div>
        ) : (
          <p>No user found</p>
        )}
      </div>
    </>
  );
}

export default UserProfile;
