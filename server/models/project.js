const mongoose = require('mongoose');
const Client = require('./client'); // Adjust path as needed

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
 
    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense'
    }]
});


module.exports = mongoose.model('Project', projectSchema);
