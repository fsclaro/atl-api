const mongodb = require('../../database');

const TaskSchema = new mongodb.Schema({
  title: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: mongodb.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completed: {
    type: Boolean,
    require: true,
    default: false
  },
  completedUntil: {
    type: Date,
    require: true,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongodb.model('Task', TaskSchema);

module.exports = Task;
