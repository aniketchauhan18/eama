const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { User } = require('../models/db');
const { userRegistrationSchema } = require('../auth/schema/userSchema');
const { updateUserSchema } = require('../auth/schema/userSchema');
const loginSchema = require('../auth/schema/loginSchema');
const adminMiddleWare = require('../middleware/adminMiddleware');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
adminMiddleWare;

router.post('/register', async (req, res) => {
  const { success } = userRegistrationSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      error: "Invalid request body"
    })
  }
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: hashedPassword,
      type: req.body.role
    })
    
    // exclude fields from the returned document. Here's how you can modify your code to exclude the password
    const userToReturn = await User.findById(newUser._id).select('-password')

    res.status(200).json({
      msg: "User created successfully",
      user: userToReturn
    })

  } catch {
    return res.status(500).json({
      error: "Internal serve error"
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { success } = loginSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        error: "Invalid request body"
      })
    }

    const user = await User.findOne({
      username: req.body.username
    })

    if (!user) {
      return res.status(400).json({
        error: "Invalid username or password"
      })
    }
    console.log(user.password);
    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if (!validPassword) {
      return res.status(400).json({
        error: "Invalid username or password"
      })
    }

    const token = jwt.sign({
      id: user._id
    }, 'hithere');
    
    res.json({
      token
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      error: "Internal server error"
    })
  }
});

router.put('/:userid',authenticationMiddleware, adminMiddleWare, async(req, res) => {
  const { success, data } = updateUserSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      error: "Invalid request body"
    })
  }

  try {
    const id = req.params.userid;
    if (data.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    }

    const user = await User.findByIdAndUpdate(id, data, {new: true, runValidators: ture})

    if (!user) {
      return res.status(404).json({
        error: "user not found"
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

router.delete('/:userid',authenticationMiddleware, adminMiddleWare, async(req, res) =>{
  try {
    const id = req.params.userid;
    const user = await User.findByIdAndDelete(id);
    if (!user){
      return res.status(404).json({
        error: "User not found"
      })
    }
    res.status(200).json({
      message: "user deleted successfully"
    })
  } catch {
    return res.status(500).json({
      error: "Internal server error"
    })
  }
})


module.exports = router;