const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');

app.use(userRouter);
app.use(taskRouter)

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('our db is connected')
}).catch(err => console.log(err.message));

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
