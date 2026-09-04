// require('dotenv').config();
// const express = require("express");
// const app = express();
// const cors = require('cors');


// app.use(cors()); 
// app.use(express.json());


// // const transactionsRouter = require('./Routes/transactions');
// // app.use('/',transactionsRouter);
// app.get('/', (req, res) => {
//   res.send('Hi');
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import projectsRouter from "./Routes/projects.js";
import timesavingsRouter from "./Routes/timesavings.js";
import costsavingsRouter from "./Routes/costsavings.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/projects', projectsRouter);
app.use('/api/timesavings', timesavingsRouter);
app.use('/api/costsavings', costsavingsRouter);

app.get('/', (req, res) => {
  res.send('Hi this is a test response from the server');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
