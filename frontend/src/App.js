// App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    hobbies: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/data', formData);
      setFormData({ name: '', phoneNumber: '', email: '', hobbies: '' });
      fetchData();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleUpdate = async (id) => {
    // You need to implement the logic to update the data using the provided ID
    console.log('Update ID:', id);
  };

  const handleDelete = async (id) => {
    try {
        // Implement your delete logic here
        // For example, you can make a DELETE request to delete the data
        await axios.delete(`http://localhost:5000/api/data/${id}`);
        console.log('Data deleted');

        // Remove the deleted row from the local state
        setData(prevData => prevData.filter(item => item._id !== id));
    } catch (error) {
        console.error('Error deleting data:', error);
    }
};

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} placeholder="Hobbies" />
        <button type="submit">Save</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Hobbies</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.phoneNumber}</td>
              <td>{item.email}</td>
              <td>{item.hobbies}</td>
              <td>
                <button onClick={() => handleUpdate(item._id)}>Update</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
