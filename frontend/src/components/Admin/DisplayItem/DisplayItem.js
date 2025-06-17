import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import './DisplayItem.css';

function DisplayItem() {
  const [inventory, setInventory] = useState([]);
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    const result = await axios.get("http://localhost:8080/inventory");
    setInventory(result.data);
  };

  const UpdateNavigate = (id) => {
    window.location.href = `/updateitem/${id}`;
  };

  const deleteItem = async (id) => {
    const confirmationMessage = window.confirm("Are you sure you want to delete this item?");
    if (confirmationMessage) {
      try {
        await axios.delete(`http://localhost:8080/inventory/${id}`);
        loadInventory();
        alert("Item deleted Successfully");
      } catch (error) {
        alert("Error Deleting Item");
      }
    }
  };

  const generatePdf = (inventory) => {
    const doc = new jsPDF("portrait");
    doc.text("Inventory item list", 14, 10);
    const tableData = inventory.map((item) => [
      item.itemId,
      item.itemName,
      item.itemCategory,
      item.itemQty,
      item.itemDetails,
    ]);
    doc.autoTable({
      head: [['Item ID', 'Item Name', 'Category', 'Quantity', 'Details']],
      body: tableData,
      startY: 20,
    });
    doc.save("inventory_item_list.pdf");
  };

  const filteredData = inventory.filter((item) =>
    item.itemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="display-container">
      <h1>ITEM LIST</h1>

      <div className="top-actions">
        <button className="add-btn" onClick={() => window.location.href = '/additem'}>
          Add New Item
        </button>
        <button className="download-btn" onClick={() => generatePdf(inventory)}>
          Download Report
        </button>
      </div>

    <div className='search-bar-container'>
      <input
        type="text"
        className="search-bar"
        placeholder="Search by Item ID or Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    <table className="inventory-table">
      <thead>
        <tr>
          <th>Item ID</th>
          <th>Item</th>
          <th>Item Name</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Details</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((item, index) => (
          <tr key={index}>
            <td>{item.itemId}</td>
            <td>
              <img
                src={`http://localhost:8080/backend/src/main/uploads/${item.itemImage}`}
                alt={item.itemName}
              />
            </td>
            <td>{item.itemName}</td>
            <td>{item.itemCategory}</td>
            <td>{item.itemQty}</td>
            <td>{item.itemDetails}</td>
            <td>
              <button className="update-btn" onClick={() => UpdateNavigate(item.id)}>
                Update
              </button>
              <button className="delete-btn" onClick={() => deleteItem(item.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default DisplayItem;
