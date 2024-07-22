const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/securePasswordDB')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

const userSchema = new mongoose.Schema({
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

app.post('/api/store-password', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Password stored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
