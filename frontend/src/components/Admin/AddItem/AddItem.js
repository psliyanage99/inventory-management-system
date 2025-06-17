import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./AddItem.css";

function AddItem() {
//Navigate part
  const navigate = useNavigate();
//Call the data from model
  const [inventory, setInventory] = useState({
    itemId: '',
    itemName: '',
    itemCategory: '',
    itemQty: '',
    itemDetails: '',
    itemImage: ''
  });
  //That data assigned to the inventory variable
  const { itemId, itemName, itemCategory, itemQty, itemDetails } = inventory;
  
  //Create a onInputChange as set to itemImage
  const onInputChange = (e) => {
    if (e.target.name === 'itemImage') {
      setInventory({ ...inventory, itemImage: e.target.files[0] });
    } else {
      setInventory({ ...inventory, [e.target.name]: e.target.value });
    }
  };

  // Call the onSubmit for form
  const onSubmit = async (e) => {
    e.preventDefault();
    // Image upload part
    const formData = new FormData();
    formData.append("file", inventory.itemImage);
    let imageName = "";

    try { 
      const response = await axios.post('http://localhost:8080/inventory/itemImg', formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      imageName = response.data;
    } catch (error) {
      alert("Error uploading image");
      return;
    }

    // Prepare the data to be sent to database
    const updateInventory = { ...inventory, itemImage: imageName };
    await axios.post("http://localhost:8080/inventory", updateInventory);
    alert("Item added successfully");
    window.location.reload();
  }

  const generateItemId = () => {
    const prefix = "ID"; // The id should be displayed first.
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  }
  useEffect(() => {
    setInventory((prevInputs) => ({
      ...prevInputs,
      itemId: generateItemId(),
    }));
  }, []);

  return (
    <div>
      <div>
      <p className='auth-topic'>ADD ITEM</p>
      <div className="from_vontiner">
        <div className="from_sub_coon">
          <form id='itemForm' onSubmit={(e) => onSubmit(e)}>
            <label htmlFor="itemId">Item ID:</label><br />
            <input type="text" id="itemId" name="itemId" onChange={(e) => onInputChange(e)} value={itemId} required readOnly/><br />

            <label htmlFor="itemName">Item Name:</label><br />
            <input type="text" id="itemName" name="itemName" onChange={(e) => onInputChange(e)} value={itemName} required/><br />

            <label htmlFor="itemCategory">Item Category:</label><br />
            <select id="itemCategory" name="itemCategory" onChange={(e) => onInputChange(e)} value={itemCategory} required>
              <option value="" disabled>Select Item Category</option>
              <option value="Apparel & Fashion">Apparel & Fashion</option>
              <option value="Electronics & Gadgets">Electronics & Gadgets</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Home & Furniture">Home & Furniture</option>
            </select><br />

            <label htmlFor="itemQty">Item Quantity:</label><br />
            <input type="number" id="itemQty" name="itemQty" onChange={(e) => onInputChange(e)} value={itemQty} required/><br />

            <label htmlFor="itemDetails">Item Details:</label><br />
            <textarea id="itemDetails" name="itemDetails"  onChange={(e) => onInputChange(e)} value={itemDetails} required></textarea><br />

            <label htmlFor="itemImage">Item Image</label><br />
            <input 
              type="file" 
              id="itemImage" 
              name="itemImage" 
              accept="image/*" 
              onChange={(e) => onInputChange(e)}
            /><br />

            <button type='submit' className='fom-btn'>Submit</button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}

export default AddItem;