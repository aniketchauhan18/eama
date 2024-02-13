const mongoose = require('mongoose');

const encodedPassword = encodeURIComponent("2004@Niket");

// Use the encoded password in the connection string
mongoose.connect(`mongodb+srv://workwithaniket18:${encodedPassword}@cluster0.fty46m3.mongodb.net/EAMA`);

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student'
  }
});

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  schedule: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  sessions: [{
    date: {
      type: Date,
      required: true
    },
    attendance: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['present', 'absent'],
        default: 'absent'
      }
    }]
  }]
})

const Class = mongoose.model('Class', classSchema);

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  Class
}