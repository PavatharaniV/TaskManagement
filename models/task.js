const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title:
    {
        type: String,
        required: true
    },
    description: String,
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Task', TaskSchema);
