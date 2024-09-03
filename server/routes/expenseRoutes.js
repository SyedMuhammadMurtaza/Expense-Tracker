const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');
const Project = require('../models/project');

// Get all expenses under a specific project
router.get('/:projectId', async (req, res) => {
    try {
        const expenses = await Expense.find({ projectId: req.params.projectId });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error loading expenses' });
    }
});

// Create a new expense under a project
router.post('/', async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();

        // Add the expense to the corresponding project
        await Project.findByIdAndUpdate(expense.projectId, { $push: { expenses: expense._id } });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Error creating expense' });
    }
});

module.exports = router;
