const express = require('express');
const app = express();
const cors = require('cors');
const authenticationMiddleware = require('./middleware/authenticationMiddleware');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const classRoutes = require('./routes/classRoutes');
const { User } = require('./models/db');
app.use(express.json());
app.use(cors());
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/class', classRoutes);

app.get('/users', authenticationMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users)

  } catch {
    res.status(411).json({
      error: 'Error while fetching users'
    })
  }
}) 

app.listen(3000, () =>{
  console.log("Server is listening on port 3000")
})