const Task = require('../models/task')

exports.createTask = async (req, res) => {

    const {
         title, 
         description
         } = req.body;

    const task = new Task({ title, description, userId: req.user.id });

    await task.save();

    res.status(201).json(true);
}

exports.getAllTasks = async (req, res) => {

    const tasks = await Task.find({ userId: req.user.id });

    res.json(tasks);
}

exports.getTaskById = async (req, res) => {

    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json(task);
}

exports.updateTask = async (req, res) => {

    const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true }
    );

    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.json(updatedTask);
}

exports.deleteTask = async (req, res) => {

    const deletedTask = await Task.findOneAndDelete({ 
        _id: req.params.id,
         userId: req.user.id 
        });
        
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: true });
}
