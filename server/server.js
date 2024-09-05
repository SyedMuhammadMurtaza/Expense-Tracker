// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();


// app.use(cors());
// app.use(express.json());

// app.use('/api/clients', require('./routes/clientRoutes'));
// app.use('/api/projects', require('./routes/projectRoutes'));
// app.use('/api/expenses', require('./routes/expenseRoutes'));

// // Connect to MongoDB
// const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
// mongoose.connection.once('open', () => {
//     console.log('Connected to MongoDB');
// });

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

// Root route to check if server is running
app.get('/', (req, res) => {
    res.send('Expense Tracker Backend is running.');
});

// Connect to MongoDB
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', console.error.bind(console, 'Database connection error:'));
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
