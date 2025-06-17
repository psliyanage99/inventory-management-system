import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    const result = await axios.get("http://localhost:8080/inventory");
    setInventory(result.data);
  };

  const filteredData = inventory.filter(
    (item) =>
      item.itemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo">INVENTORY</div>
        <div className="nav-links">
          <span className="active" onClick={() => navigate('/home')}>Home</span>
          <span onClick={() => navigate('/profile')}>Profile</span>
          <span onClick={handleLogout}>Logout</span>
        </div>
      </nav>

      <div className="home-container">
        <h1>INVENTORY ITEMS</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search by ID or name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="item-grid">
          {filteredData.map((item, index) => (
            <div className="item-card" key={index}>
              <div className="item-img">
                <img
                  src={`http://localhost:8080/backend/src/main/uploads/${item.itemImage}`}
                  alt={item.itemName}
                />
              </div>
              <h3>{item.itemName.toUpperCase()}</h3>
              <p className="category">{item.itemCategory}</p>
              <p className="qty">{item.itemQty}</p>
              <p className="description">{item.itemDetails}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
