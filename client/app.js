const apiUrl = 'http://localhost:5000/api';

// Load all clients on page load
const loadClients = async () => {
    try {
        const res = await fetch(`${apiUrl}/clients`);
        const clients = await res.json();
        const clientList = document.getElementById('client-list');
        clientList.innerHTML = clients.map(client => 
            `<li><a href="#" data-id="${client._id}">${client.name}</a></li>`
        ).join('');

        // Add click event listeners to each client
        document.querySelectorAll('#client-list a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const clientId = e.target.getAttribute('data-id');
                loadProjects(clientId, e.target.textContent);
            });
        });
    } catch (error) {
        console.error('Error loading clients:', error);
    }
};

// Load projects for a specific client
const loadProjects = async (clientId, clientName) => {
    try {
        const res = await fetch(`${apiUrl}/projects/${clientId}`);
        const projects = await res.json();

        const projectList = document.getElementById('project-list');
        projectList.innerHTML = projects.map(project => 
            `<li><a href="#" data-id="${project._id}"> ${project.name}</a></li>`
        ).join('');

        // Show the projects section and update client name
        document.getElementById('project-section').style.display = 'block';
        document.getElementById('current-client-name').textContent = clientName;

        // Add click event listeners to each project
        document.querySelectorAll('#project-list a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = e.target.getAttribute('data-id');
                loadExpenses(projectId, e.target.textContent);
            });
        });

        // Handle project creation for this client
        document.getElementById('project-form').onsubmit = async (e) => {
            e.preventDefault();
            const name = document.getElementById('project-name').value;
            document.getElementById('project-name').value='';
            const description = document.getElementById('project-description').value;
            await createProject({ name, description, clientId });
            loadProjects(clientId, clientName); // Reload the projects
        };

    } catch (error) {
        console.error('Error loading projects:', error);
    }
};

// Load expenses for a specific project
const loadExpenses = async (projectId, projectName) => {
    try {
        // Fetch the expenses for the given project ID
        const res = await fetch(`${apiUrl}/expenses/${projectId}`);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const expenses = await res.json();

        // Get unique investment options for the dropdown
        const uniqueInvestments = [...new Set(expenses.map(expense => expense.investment))];
        const investmentFilter = document.getElementById('investment-filter');

        // Populate the dropdown with investment options
        investmentFilter.innerHTML = `<option value="all">All</option>` +
            uniqueInvestments.map(investment => `<option value="${investment}">${investment}</option>`).join('');

        // Function to display expenses and total amount
        const displayExpenses = (filteredExpenses) => {
            const totalAmount = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);

            const expenseList = document.getElementById('expense-list');
            expenseList.innerHTML = filteredExpenses.map(expense => 
                `<li>${new Date(expense.date).toLocaleDateString('en-GB')} ${expense.description} - $${expense.amount.toFixed(2)} - ${expense.investment}</li>`
            ).join('');

            // Add the total expenses at the bottom
            const totalElement = document.createElement('li');
            totalElement.innerHTML = `<strong>Total: $${totalAmount.toFixed(2)}</strong>`;
            expenseList.appendChild(totalElement);
        };

        // Initially display all expenses
        displayExpenses(expenses);

        // Filter expenses based on the selected investment option
        investmentFilter.addEventListener('change', () => {
            const selectedInvestment = investmentFilter.value;
            const filteredExpenses = selectedInvestment === 'all'
                ? expenses
                : expenses.filter(expense => expense.investment === selectedInvestment);
            displayExpenses(filteredExpenses);
        });

        // Reset the filter and display all expenses
        document.getElementById('reset-filter').addEventListener('click', () => {
            investmentFilter.value = 'all';
            displayExpenses(expenses);
        });

        // Show the expenses section and update project name
        document.getElementById('expense-section').style.display = 'block';
        document.getElementById('current-project-name').textContent = projectName;

        // Handle expense creation for this project
        document.getElementById('expense-form').onsubmit = async (e) => {
            e.preventDefault();
            const date = document.getElementById('expense-date').value;
            document.getElementById('expense-date').value = '';
            const description = document.getElementById('expense-description').value;
            document.getElementById('expense-description').value = '';
            const amount = parseFloat(document.getElementById('expense-amount').value);
            document.getElementById('expense-amount').value = '';
            const investment = document.getElementById('investment').value;
            document.getElementById('investment').value = '';

            await createExpense({ description, amount, date, investment, projectId });
            loadExpenses(projectId, projectName); // Reload the expenses and total after adding a new expense
        };

    } catch (error) {
        console.error('Error loading expenses:', error);
    }
};


// Create a new project
const createProject = async (project) => {
    try {
        const res = await fetch(`${apiUrl}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        });

        if (!res.ok) {
            throw new Error('Error creating project');
        }
    } catch (error) {
        console.error(error);
    }
};

// Create a new expense
const createExpense = async (expense) => {
    try {
        const res = await fetch(`${apiUrl}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expense),
        });

        if (!res.ok) {
            throw new Error('Error creating expense');
        }
    } catch (error) {
        console.error(error);
    }
};

// Handle client creation form submission
document.getElementById('client-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('client-name').value;
    const contactInfo = document.getElementById('client-contact').value;
    const description = document.getElementById('client-description').value;

    try {
        const res = await fetch(`${apiUrl}/clients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, contactInfo, description }),
        });

        if (res.ok) {
            loadClients(); // Reload the clients list
            document.getElementById('client-form').reset(); // Reset the form
        } else {
            console.error('Error creating client:', res.statusText);
        }
    } catch (error) {
        console.error('Error creating client:', error);
    }
});

// Load clients on page load
document.addEventListener('DOMContentLoaded', loadClients);
