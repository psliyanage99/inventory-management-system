import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import "./UpdateItem.css"
function UpdateItem() {
    const { id } = useParams(); // Define the id
    const [formData, setFormData] = useState({ // Set the form data
        itemId: '',
        itemName: '',
        itemCategory: '',
        itemQty: '',
        itemDetails: '',
        itemImage: null,
    });


    useEffect(() => { // To display existing data
        const fetchItemData = async () => {
            try{
              // if (!id) {
              //   console.warn("No ID provided in URL.");
              //   return;
              // }

                const response = await axios.get(`http://localhost:8080/inventory/${id}`); // API call withing backtick
                const itemData = response.data;

                setFormData({ //There is no data show like this 
                    itemId: itemData.itemId || '',
                    itemName: itemData.itemName || '',
                    itemCategory: itemData.itemCategory || '',
                    itemQty: itemData.itemQty || '',
                    itemDetails: itemData.itemDetails || '',
                    itemImage: null
                });
            }catch (err) { // If there any error that setup
                console.error('error fetch data : ', err);
            }
        };
        fetchItemData();      
    },[id]);

    const onInputChange = (e) => {
        const {name,value,files} = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value, 
        })
    };
    const onSubmit = async (e) => { // What happens when you enter data?
        e.preventDefault();
        const data = new FormData();
        data.append('itemDetails', JSON.stringify({ // The existing data will be updated and the new data will be set.
            itemId:formData.itemId,
            itemName:formData.itemName,
            itemCategory:formData.itemCategory,
            itemDetails:formData.itemDetails,
            itemQty: formData.itemQty,
        }));

        if (formData.itemImage) {
            data.append('file', formData.itemImage);
        }
        
        try{
           const response = await axios.put(`http://localhost:8080/inventory/${id}`,data); //Call the path that the data needs to go .
           alert("Item updated") // After updated data  display the alert then navigate to all_item page
           window.location.href = "/allitems";
        }catch (err){
            console.error('error updating data : ', err); // If There is any error show that error as alert 
            alert("Error updating item");
        }
    };
    
  return (
    <div>
        <h1>UPDATE ITEM</h1>
        <div>
      
      <div className="from_vontiner">
        <div className="from_sub_coon">
          <form id='itemForm' onSubmit={onSubmit}>
            <label htmlFor="itemId">Item ID:</label><br />
            <input type="text" id="itemId" name="itemId" onChange={onInputChange} value={formData.itemId} required/><br />

            <label htmlFor="itemName">Item Name:</label><br />
            <input type="text" id="itemName" name="itemName" onChange={onInputChange} value={formData.itemName} required/><br />

            <label htmlFor="itemCategory">Item Category:</label><br />
            <select id="itemCategory" name="itemCategory" onChange={onInputChange} value={formData.itemCategory} required>
              <option value="" disabled>Select Item Category</option>
              <option value="Apparel & Fashion">Apparel & Fashion</option>
              <option value="Electronics & Gadgets">Electronics & Gadgets</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Home & Furniture">Home & Furniture</option>
            </select><br />

            <label htmlFor="itemQty">Item Quantity:</label><br />
            <input type="number" id="itemQty" name="itemQty" onChange={onInputChange} value={formData.itemQty} required/><br />

            <label htmlFor="itemDetails">Item Details:</label><br />
            <textarea id="itemDetails" name="itemDetails"  onChange={onInputChange} value={formData.itemDetails} required></textarea><br />

            <label htmlFor="itemImage">Item Image</label><br />
            <input 
              type="file" 
              id="itemImage" 
              name="itemImage" 
              accept="image/*" 
              onChange={onInputChange}
            /><br />

            <button type='submit' className='fom-btn'>Submit</button>
          </form>
        </div>
      </div>
      </div>
    </div>
    
  )
}

export default UpdateItem



