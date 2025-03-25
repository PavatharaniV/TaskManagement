const express = require('express');

const router = express.Router();
const { isAuth } = require('../middleware/auth');
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } = require('../controllers/task');
 
router.post('/tasks', isAuth, createTask);
router.get('/tasks', isAuth, getAllTasks);
router.get('/tasks/:id', isAuth, getTaskById)
router.put('/tasks/:id', isAuth, updateTask)
router.delete('/tasks/:id', isAuth, deleteTask)

module.exports = router;