const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date:{
        type:Date,
        required:true,
    },
    investment:{
        type:String,
        required:true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    }
});

module.exports = mongoose.model('Expense', expenseSchema);
