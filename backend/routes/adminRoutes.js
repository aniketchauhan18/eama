const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { User } = require('../models/db');
const { userRegistrationSchema } = require('../auth/schema/userSchema');
const { updateUserSchema } = require('../auth/schema/userSchema');
const loginSchema = require('../auth/schema/loginSchema');
const adminMiddleWare = require('../middleware/adminMiddleware');


router.post('/register', async (req, res) =>{
  const {success} = userRegistrationSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      error: "Invalid request body"
    })
  }
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: hashedPassword,
      role: req.body.role
    })
    
    const userToReturn = await User.findById(newUser._id).select('-password');
    res.status(200).json({
      message: "Admin created successfully",
      userToReturn
    })
  } catch {
    return res.status(500).json({
      error: "Internal server error"
    })
  }
})

router.post('/login', async (req, res) => {
  const {success} = loginSchema.safeParse(req.body);
  
  if(!success) {
    return res.status(400).json({
      error: "Invalid admin name and password"
    })
  }

  try {
    const user = await User.findOne({
      username: req.body.username
    })
    if (!user) {
      return res.status(400).json({
        error: "Invalid admin name or password"
      })
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        error: "Invalid admin name or password"
      })
    }
    
    const token = jwt.sign({
      id: user._id
    }, 'hithere');

    res.status(200).json({
      token
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      error: "Internal server error"
    })
  }
});

router.get('/users',adminMiddleWare, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch {
    res.status(500).json({
      error: "Error while fetching users"
    })
  }
})

router.delete('/:userid', adminMiddleWare, async(req, res) => {
  try {
    const id = req.params.userid;
    const admin = await User.findByIdAndDelete(id);
    if (!admin){
      return res.status(404).json({
        error: "User not found"
      })
    }
    res.status(200).json({
      message: "User deleted successfullt"
    })
  } catch {
    return res.status(500).json({
      error: "Internal server error"
    })
  }
})


router.put('/admin/user/:userid', adminMiddleWare, async(req, res) => {
  const { success, data } = updateUserSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      error: "Invalid request body"
    })
  }

  try {
    const id = req.params.userid;

    if (data.password) {
      const salt  = await  bcrypt.genSalt();
      data.password = await becrypt.has(data.password, salt);
    }

    const user = await User.findByIdAndUpdate(id, data, {new: true, runValidators: true});
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      })
    }

    const userToReturn = await User.findById(user._id).select('-password');

    res.json(userToReturn)

  }catch {
    return res.status(500).json({
      error: "Internal server error"
    })
  }
})

module.exports = router;