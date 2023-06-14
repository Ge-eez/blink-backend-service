const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  month: Number,
  timeSpent: Number
});

const UserActivity = mongoose.model('UserActivity', UserActivitySchema);

module.exports = UserActivity;
