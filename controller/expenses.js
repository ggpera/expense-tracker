const Joi = require('joi');
const expenses = require('../model/expenses');

const getExpenses = async (req, res) => {
  try {
    const response = await expenses.findAll();
    if (response) {
      res.send(response);
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const getExpenseById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const response = await expenses.findById(id);
    if (response.length === 1) {
      res.send(response[0]);
    } else {
      res.status(404).json('Not Found');
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const getExpenseByMonth = async (req, res) => {
  const m = parseInt(req.params.i, 10);
  try {
    const response = await expenses.findByMonth(m);
    if (response) {
      res.send(response);
    } else {
      res.status(404).json('Not Found');
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const getExpenseByCategory = async (req, res) => {
  const name = req.query.category;
  try {
    const response = await expenses.findByCategory(name);
    if (response) {
      res.send(response);
    } else {
      res.status(404).json('Not Found');
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const createExpense = async (req, res) => {
  const schema = Joi.object({
    date: Joi.string().min(1).required(),
    amount: Joi.number().min(1).required(),
    category: Joi.string().min(1).required(),
    shop: Joi.string().min(1).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const expense = {
    date: req.body.date,
    amount: req.body.amount,
    category: req.body.category,
    shop: req.body.shop,
  };
  try {
    const response = await expenses.save(expense);
    if (response) {
      expense.id = response.insertId;
      res.status(201).send(expense);
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const updateExpense = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
    date: Joi.string().min(1).required(),
    amount: Joi.number().min(1).required(),
    category: Joi.string().min(1).required(),
    shop: Joi.string().min(1).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const expense = {
    id: req.body.id,
    date: req.body.date,
    amount: req.body.amount,
    category: req.body.category,
    shop: req.body.shop,
  };
  try {
    const response = await expenses.updateById(expense);
    if (response) {
      res.send(expense);
    } else {
      res.status(404).json('Not Found');
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const deleteExpense = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await expenses.findById(id);
    if (result.length === 0) {
      res.status(404).send('Not Found');
      return;
    }

    const response = await expenses.deleteById(id);
    if (response.affectedRows === 1) {
      res.status(200).send('Expense deleted');
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

module.exports = {
  createExpense,
  deleteExpense,
  getExpenses,
  getExpenseById,
  getExpenseByMonth,
  getExpenseByCategory,
  updateExpense,
};
