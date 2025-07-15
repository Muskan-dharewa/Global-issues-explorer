const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from the same directory
app.use(express.static(path.join(__dirname)));

// MongoDB connection
const mongoURI = 'mongodb+srv://login:12345@cluster-1.p03opc1.mongodb.net/data?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a schema for contributions
const contributionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Contribution = mongoose.model('Contribution', contributionSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'aboutglobal.html'));
});

app.post('/submit-contribution', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const newContribution = new Contribution({
      name,
      email,
      message
    });

    await newContribution.save();
    
    res.status(200).json({ message: 'Thank you for your contribution! Your story has been saved.' });
  } catch (error) {
    console.error('Error saving contribution:', error);
    res.status(500).json({ message: 'An error occurred while saving your contribution.' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});