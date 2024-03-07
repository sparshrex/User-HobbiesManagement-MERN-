// server.js
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import transporter from './emailConfig.js'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://rexsparsh:sparsh@cluster0.euk3hj5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Schema = mongoose.Schema;

const dataSchema = new Schema({
  name: {type:String, required:true, trim:true},
  phoneNumber: {type:String, required:true, trim:true},
  email: {type:String, required:true, trim:true},
  hobbies: {type:String, required:true, trim:true},
});

const Data = mongoose.model('Data', dataSchema);

app.get('/api/data', async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/data', async (req, res) => {
  const {name,email,phoneNumber,hobbies}=req.body
  switch(true){
      case !name:
          return res.status(500).send({error:'Name is Required',})
      case !phoneNumber:
          return res.status(500).send({error:'Phone number is Required',})
      case !email:
          return res.status(500).send({error:'Email is Required',})
      case !hobbies:
           return res.status(500).send({error:'Hobbies is Required',})
  }

  const newData = new Data(req.body);
  try {
    await newData.save();
    res.json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/data/:id', async (req, res) => {
    try {
        const updatedData = await Data.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedData);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/data/:id', async (req, res) => {
    try {
        await Data.findByIdAndDelete(req.params.id);
        res.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/send-email', async (req, res) => {
  const {users} = req.body;
  
  let htmlContent = `<h2>User Information</h2>`;
  
  for (let user of users) {
      htmlContent += `
          <table border="1">
              <tr>
                  <th>Name</th>
                  <td>${user.name}</td>
              </tr>
              <tr>
                  <th>Email</th>
                  <td>${user.email}</td>
              </tr>
              <tr>
                  <th>Phone</th>
                  <td>${user.phoneNumber}</td>
              </tr>
              <tr>
                  <th>Hobbies</th>
                  <td>${user.hobbies}</td>
              </tr>
          </table>
          <br>`;
  }

  let info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "User Information",
      html: htmlContent
  });

  res.send({message:"Email sent successfully",
  info});
})



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
