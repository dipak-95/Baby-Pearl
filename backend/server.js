require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8004;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/baby_photo_prompt')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const photosRouter = require('./routes/photos');
app.use('/api/photos', photosRouter);

const adminRouter = require('./routes/admin');
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
    res.send('Baby Photo AI Prompt API is Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
