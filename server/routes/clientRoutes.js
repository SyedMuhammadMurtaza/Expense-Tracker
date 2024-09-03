const express = require('express');
const router = express.Router();
const Client = require('../models/client');
const Project = require('../models/project');

// Get all clients with their projects
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find().populate('projects');
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error loading clients' });
    }
});

// Create a new client
router.post('/', async (req, res) => {
    try {
        const client = new Client(req.body);
        await client.save();
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error creating client' });
    }
});

// Get a client by ID and its projects
router.get('/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).populate('projects');
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error loading client' });
    }
});

module.exports = router;
