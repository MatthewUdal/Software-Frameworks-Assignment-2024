const mongoose = require('mongoose');

// Define the report schema
const reportSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
    required: true,
  }
});

// Create the report model
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
