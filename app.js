const express = require('express');
const cors = require('cors');
const expRouter = require('./routes/expenses');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('frontend/build'));

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
app.use('/api/expenses', expRouter);

module.exports = app;
