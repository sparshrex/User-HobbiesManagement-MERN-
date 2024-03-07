import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function App() {
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    hobbies: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://user-hobbies-management-mern.vercel.app/api/data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://user-hobbies-management-mern.vercel.app/api/data", formData);
      setFormData({ name: "", phoneNumber: "", email: "", hobbies: "" });
      fetchData();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // const handleUpdate = async (id) => {
  //   console.log('Update ID:', id);

  //   try {
  //     await axios.post('https://user-hobbies-management-mern.vercel.app//api/data', formData);
  //     setFormData({ name: '', phoneNumber: '', email: '', hobbies: '' });
  //     fetchData();
  //   } catch (error) {
  //     console.error('Error submitting data:', error);
  //   }
  // };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://user-hobbies-management-mern.vercel.app/api/data/${id}`);
      console.log("Data deleted");

      setData((prevData) => prevData.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const [checkedItems, setCheckedItems] = useState([]);

  const handleCheckboxChange = (event, item) => {
    const isChecked = event.target.checked;

    setCheckedItems((prevCheckedItems) => {
      if (isChecked) {
        return [...prevCheckedItems, item];
      } else {
        return prevCheckedItems.filter(
          (checkedItem) => checkedItem._id !== item._id
        );
      }
    });
  };

  const sendEmail = async (data) => {
    setTimeout(() => {
      setMsg("Processing Email....");
    }, 5000);

    try {
      await axios.post("https://user-hobbies-management-mern.vercel.app/api/send-email", { users: data });

      setTimeout(() => {
        setMsg("Email sent");
      }, 5000);
    } catch (error) {
      console.error("Error sending email:", error);
      setTimeout(() => {
        setMsg(error.toString());
      }, 5000);
    }
  };

  return (
    <div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
            placeholder="Hobbies"
          />
          <button type="submit">Save</button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th></th>
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
                <td>
                  <input
                    type="checkbox"
                    onChange={(event) => handleCheckboxChange(event, item)}
                  />
                </td>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>{item.phoneNumber}</td>
                <td>{item.email}</td>
                <td>{item.hobbies}</td>
                <td>
                  <Popup
                    trigger={<button>Update</button>}
                    position="center"
                    modal
                    closeOnDocumentClick
                  >
                    <div className="popup-content">
                      <form className="">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="Phone Number"
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email"
                        />
                        <input
                          type="text"
                          name="hobbies"
                          value={formData.hobbies}
                          onChange={handleChange}
                          placeholder="Hobbies"
                        />
                        <button type="submit">Update</button>
                      </form>
                    </div>
                  </Popup>
                  <button
                    style={{ backgroundColor: "red" }}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="send-email">
        <span style={{ color: "white" }}>{msg}</span>
        <button onClick={() => sendEmail(checkedItems)}>Send Email</button>
        <p>All above checked box data will be sent via email</p>
      </div>
    </div>
  );
}

export default App;
