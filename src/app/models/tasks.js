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
    autopopulate: true,
  },
  completedUntil: {
    type: Date,
    require: true,
    default: null,
  },
  completed: {
    type: Date,
    require: false,
  },
  group: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    require: false,
  },
});

TaskSchema.plugin(require('mongoose-autopopulate'));

const Task = mongodb.model('Task', TaskSchema);

module.exports = Task;
