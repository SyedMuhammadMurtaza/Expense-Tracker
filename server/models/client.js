const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactInfo: {
        type: String,
        required: true
    },
    description: String,
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }]
});

module.exports = mongoose.model('Client', clientSchema);
