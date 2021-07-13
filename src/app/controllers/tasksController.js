const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth');

const Task = require('../models/tasks');

router.use(authMiddleware);

// get all todos
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();

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
    const { title, description, tasks } = req.body;
    const task = await Task.create({ title, description, user: req.userId });

    task.save();

    return res.send({ task });
  } catch (error) {
    return res.
      status(400).
      send({ error: 'Erro na criação da tarefa.\n' + error.message });
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
