require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');


app.use(cors()); 
app.use(express.json());


const transactionsRouter = require('./Routes/transactions');
app.use('/',transactionsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});