import React, { useState, useEffect } from 'react';

const App = () => {
  const [data, setData] = useState([]); 
  const [form, setForm] = useState({
    product_id: '',
    title: '',
    price: '',
    sku: '',
  });
  const [feedback, setFeedback] = useState(''); 

  
  useEffect(() => {
    const fetchData = () => {
      const fileData = window.api.readJSONFile();
      if (fileData && Array.isArray(fileData)) {
        setData(fileData);
        setFeedback('Data loaded successfully!');
      } else {
        setFeedback('No data found. Add some products!');
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { product_id, title, price, sku } = form;
    if (!product_id || !title || !price || !sku) {
      setFeedback('All fields are required!');
      return false;
    }
    if (isNaN(price)) {
      setFeedback('Price must be a valid number!');
      return false;
    }
    return true;
  }; 

  const handleAddProduct = () => {
    if (!validateForm()) return;

    const newProduct = {
      product_id: form.product_id,
      title: form.title,
      price: form.price,
      sku: form.sku,
    };

    window.api.createJSONFile(newProduct);
    setData((prevData) => [...prevData, newProduct]);

    setForm({ product_id: '', title: '', price: '', sku: '' });
    setFeedback('Product added successfully!');
  };

  return (
    <div className="app-container">
      <h1 className='title'>Product Management Tool</h1>

      {feedback && <p className="feedback">{feedback}</p>}

      <div className="form">
        <input
          type="text"
          name="product_id"
          placeholder="Product ID"
          value={form.product_id}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleInputChange}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      {data.length > 0 ? (
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Title</th>
              <th>Price (INR)</th>
              <th>SKU</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, index) => (
              <tr key={index}>
                <td>{product.product_id}</td>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td>{product.sku}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products available. Add some!</p>
      )}
    </div>
  );
};

export default App;
