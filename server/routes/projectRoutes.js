const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const Client = require('../models/client');

// Get all projects under a specific client
router.get('/:clientId', async (req, res) => {
    try {
        const projects = await Project.find({ clientId: req.params.clientId }).populate('expenses');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error loading projects' });
    }
});

// Create a new project under a client
router.post('/', async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();

        // Add the project to the corresponding client
        await Client.findByIdAndUpdate(project.clientId, { $push: { projects: project._id } });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project' });
    }
});

module.exports = router;
