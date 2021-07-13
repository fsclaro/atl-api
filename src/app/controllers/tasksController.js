const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth');

const Task = require('../models/tasks');

router.use(authMiddleware);

// get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({deletedAt: null })
      .populate('user')
      .sort({ createdAt: -1 });

    return res.send({ tasks });
  } catch (error) {
    return res.
      status(400).
      send({ error: 'Não foi possível buscar as tarefas.\n' + error.message });
  }
});

// get any task
router.get('/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    const tasks = await Task.findById(taskId).populate('user');

    return res.json({ tasks });
  } catch (error) {
    return res
      .status(400)
      .send({ error: 'Não foi possível buscar a tarefa com ID:' + taskId + '\n' + error.message });
  }
});

// create a new task
router.post('/', async (req, res) => {
  try {
    const { title, assignedTo, completedUntil, completedAt } = req.body;

    const task = await Task.create({
      title: title,
      assignedTo: assignedTo,
      completedUntil: completedUntil,
      completedAt: completedAt,
    });

    task.save();

    return res.send({ task });
  } catch (error) {
    return res.
      status(400).
      send({ error: 'Erro na criação da tarefa.\n' + error.message });
  }
});

// close any task
router.put('/close/:taskId', async (req, res) => {
  try {
    const { completed, completedAt } = req.body;
    const taskId = req.params.taskId;

    const updateTask = {
      completed: completed,
      completedAt: completedAt,
    };

    const task = await Task.findByIdAndUpdate(taskId,
      updateTask,
      { new: true }
    );

    task.save();

    return res.send({ task });
  } catch (error) {
    return res.status(400).send({ error: 'Erro na atualização da tarefa.\n' + error.message });
  }
});

// softdelete any task
router.put('/softdelete/:taskId', async (req, res) => {
  try {
    const { deletedAt } = req.body;
    const taskId = req.params.taskId;

    const updateTask = {
      deletedAt: deletedAt,
    };

    const task = await Task.findByIdAndUpdate(taskId,
      updateTask,
      { new: true }
    );

    task.save();

    return res.send({ task });
  } catch (error) {
    return res.status(400).send({ error: 'Erro na atualização da tarefa.\n' + error.message });
  }
});



// update any task
router.put('/:taskId', async (req, res) => {
  try {
    const { title, description, tasks } = req.body;
    const { todoId } = req.params;
    const todo = await Todo.findByIdAndUpdate(
      todoId,
      { title, description },
      { new: true }
    );

    task.save();

    return res.send({ task });
  } catch (error) {
    return res.status(400).send({ error: 'Erro na atualização da tarefa.\n' + error.message });
  }
});

// delete any task
router.delete('/:taskId', async (req, res) => {
  const { taskId } = req.params;

  try {
    await Task.findByIdAndRemove(taskId);

    return res.send({message: 'Tarefa removida com sucesso.'});
  } catch (error) {
    return res
      .status(400)
      .send({ error: 'Não foi possível remover a tarefa com ID:' + todoId + '\n' + error.message });
  }
});

module.exports = (app) => app.use('/tasks', router);
