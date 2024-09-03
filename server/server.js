const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const clients = require('./routes/clientRoutes');
const projects = require('./routes/projectRoutes');
const expenses = require('./routes/expenseRoutes');


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { // Use environment variable
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Database connection error:', err));

app.use('/api/clients', clients);
app.use('/api/projects', projects);
app.use('/api/expenses', expenses);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
