const express = require('express');
const router = express.Router();
const { Class } = require('../models/db');
const { classSchema } = require('../auth/schema/classSchema');
const { updateClassSchema } = require('../auth/schema/classSchema');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const adminMiddleWare = require('../middleware/adminMiddleware');


router.post('/createClass', async (req, res) => {
  const { success } = classSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      error: "Invalid details"
    })
  }
  try {
    const classExists = await Class.findOne({
      name: req.body.name
    })
    if (classExists) {
      return res.status(400).json({
        error: "Class already exists"
      })
    }
    const createClass = await Class.create({
      name: req.body.name,
      instructor: req.body.instructor,
      enrolledStudents: req.body.enrolledStudents,
      schedule: req.body.schedule,
      description: req.body.description,
      sessions: req.body.sessions,
      students: req.body.students
    });

    res.status(200).json({
      message: "Class created successfully",
      createClass
    })
  } catch {
    return res.status(500).json({
      error: "Internal servor errorr"
    })
  }
})

router.get('/classes', async(req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes)
  } catch {
    return res.status(500).json({
      error: "Error while fetching classes"
    })
  }
})

router.put('/classes/:id', async (req, res) => {
  const { success, data } = updateClassSchema.safeParse(req.body);
  const id = req.params.id;
  if(!success) {
    return res.status(400).json({
      error: "Invalid request body"
    })
  }
  try {
    const updatedClass = await findByIdAndUpdate(id, data, {new: true, runValidators: true});
    if (!updatedClass){
      return res.status(404).json({
        error: "Class not found"
      })
    }

    res.status(200).json({
      message: "Class updated successfully",
      updatedClass
    })
  } catch {
    return res.status(500).json({
      error: "Internal server error"
    })
  }
});

router.delete('/classes/:id', async (req, res) => {
  const classId = req.params.id;
  try {
    const deletedClass = await Class.findByIdAndDelete(classId);
    if (!deletedClass){
      return res.status(404).json({
        error: "Class not found"
      })
    }
    res.status(200).json({
      message: "Class deleted successfully"
    })
  } catch {
    return res.status(500).json({
      error: "Internal server error"
    })
  }
})

router.put("/classes/:classId/enrollStudents", authenticationMiddleware, adminMiddleWare , async (req, res) => {
  const classId = req.params.classId;
  const students = req.body.students;
  try {
    const updatedClass = await Class.findByIdAndUpdate(classId, {
      $push: {
        enrolledStudents: {
          $each: students
        }
      }
    }, {new: true})

    if (!updatedClass) {
      return res.json({
        error: "Class not found"
      })
    }

    res.status(200).json({
      message: "Students enrolled successfully",
      updatedClass
    })
  } catch(error) {
    console.log("Error enrolling students", error);
    return res.status(500).json({
      error: "Internal server error"
    })
  }
})

router.get('/classes/:classId', async(req, res) => {
  const classId = req.params.classId;
  try {
    const classDetails = await Class.findById(classId);
    if (!classDetails) {
      return res.status(404).json({
        error: "Error while fecthing the class details"
      })
    }
  } catch (err) {
    console.log("Error", err)
  }
})

module.exports = router;