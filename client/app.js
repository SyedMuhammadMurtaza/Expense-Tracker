// const apiUrl = 'http://localhost:5000/api';

const apiUrl = 'https://expense-tracker-backend-u8te.onrender.com/api';

// Load all clients on page load
const loadClients = async () => {
    try {
        const res = await fetch(`${apiUrl}/clients`);
        const clients = await res.json();
        const clientList = document.getElementById('client-list');
        clientList.innerHTML = clients.map(client => {
            const firstLetter = client.name.charAt(0).toUpperCase();
            return `
                <li data-id="${client._id}">
                    <div class="client-section">
                        <div class="client-initial">${firstLetter}</div>
                        <div class="client-name">${client.name}</div>
                    </div>
                </li>`;
        }).join('');

        // Add click event listeners to each <li> element
        document.querySelectorAll('#client-list li').forEach(listItem => {
            listItem.addEventListener('click', (e) => {
                const clientId = e.currentTarget.getAttribute('data-id');
                const clientName = e.currentTarget.querySelector('.client-name').textContent;
                document.getElementById('client-screen').style.display = 'none';
                document.getElementById('project-screen').style.display = 'block';
                loadProjects(clientId, clientName);
            });
        });
    } catch (error) {
        console.error('Error loading clients:', error);
    }
};

// Load projects for a specific client
const loadProjects = async (clientId, clientName) => {
    try {
        // Fetch projects for the client
        const res = await fetch(`${apiUrl}/projects/${clientId}`);
        const projects = await res.json();

        // Select the project list element
        const projectList = document.getElementById('project-list');

        // Ensure projects is an array before mapping
        if (!Array.isArray(projects)) {
            throw new Error("Projects data is not an array");
        }

        // Populate the project list
        projectList.innerHTML = projects.map(project => 
            `<li><a href="#" data-id="${project._id}"><span class="project-name">${project.name}</span></a></li>`
        ).join('');

        // Update the current client name display
        document.getElementById('current-client-name').textContent = clientName;

        // Add click event listeners to each project link
        document.querySelectorAll('#project-list a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = e.currentTarget.getAttribute('data-id');
                const projectName = e.currentTarget.querySelector('.project-name').textContent;
                loadExpenses(projectId, projectName);
            });
        });

        // Handle project creation for the selected client
        document.getElementById('project-form').onsubmit = async (e) => {
            e.preventDefault();
            const name = document.getElementById('project-name').value.trim();
            const description = document.getElementById('project-description').value.trim();
            
            if (name) {
                await createProject({ name, description, clientId });
                loadProjects(clientId, clientName);  // Reload projects after creation
            } else {
                alert('Project name is required!');
            }
        };

        // Handle "Back to Clients" button functionality
        document.getElementById('back-to-clients').onclick = () => {
            document.getElementById('project-screen').style.display = 'none';
            document.getElementById('client-screen').style.display = 'block';
        };
    } catch (error) {
        console.error('Error loading projects:', error);
    }
};


// Load expenses for a specific project
const loadExpenses = async (projectId, projectName) => {
    try {
        const res = await fetch(`${apiUrl}/expenses/${projectId}`);
        const expenses = await res.json();

        const investmentFilter = document.getElementById('investment-filter');
        const uniqueInvestments = [...new Set(expenses.map(expense => expense.investment))];
        investmentFilter.innerHTML = `<option value="all">All</option>` +
            uniqueInvestments.map(investment => `<option value="${investment}">${investment}</option>`).join('');

        const displayExpenses = (filteredExpenses) => {
            const expenseTable = document.getElementById('expense-table-body');

            // Clear existing rows
            expenseTable.innerHTML = '';

            // Populate the table rows with filtered expenses
            filteredExpenses.forEach(expense => {
                const expenseRow = `
                    <tr>
                        <td>${new Date(expense.date).toLocaleDateString('en-GB')}</td>
                        <td>${expense.description}</td>
                        <td>$${expense.amount.toFixed(2)}</td>
                        <td>${expense.investment}</td>
                    </tr>
                `;
                expenseTable.insertAdjacentHTML('beforeend', expenseRow);
            });

            // Calculate and display total amount
            const totalAmount = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
            const totalRow = `
                <tr>
                    <td colspan="3"><strong>Total:</strong></td>
                    <td><strong>$${totalAmount.toFixed(2)}</strong></td>
                </tr>
            `;
            expenseTable.insertAdjacentHTML('beforeend', totalRow);
        };

        displayExpenses(expenses);

        investmentFilter.addEventListener('change', () => {
            const selectedInvestment = investmentFilter.value;
            const filteredExpenses = selectedInvestment === 'all'
                ? expenses
                : expenses.filter(expense => expense.investment === selectedInvestment);
            displayExpenses(filteredExpenses);
        });

        document.getElementById('reset-filter').addEventListener('click', () => {
            investmentFilter.value = 'all';
            displayExpenses(expenses);
        });

        document.getElementById('current-project-name').textContent = projectName;
        document.getElementById('expense-screen').style.display = 'block';
        document.getElementById('project-screen').style.display = 'none';

        document.getElementById('back-to-projects').onclick = () => {
            document.getElementById('expense-screen').style.display = 'none';
            document.getElementById('project-screen').style.display = 'block';
        };

        document.getElementById('expense-form').onsubmit = async (e) => {
            e.preventDefault();
            const date = document.getElementById('expense-date').value;
            const description = document.getElementById('expense-description').value;
            const amount = parseFloat(document.getElementById('expense-amount').value);
            const investment = document.getElementById('investment').value;
            await createExpense({ description, amount, date, investment, projectId });
            loadExpenses(projectId, projectName);
        };
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
};

// Event listener for creating new client
document.getElementById('client-form').onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('client-name').value;
    const contactInfo = document.getElementById('client-contact').value;
    await createClient({ name, contactInfo });
    loadClients();
};


// Create client function
const createClient = async (clientData) => {
    try {
        await fetch(`${apiUrl}/clients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clientData),
        });
    } catch (error) {
        console.error('Error creating client:', error);
    }
};

// Create project function
const createProject = async (projectData) => {
    try {
        await fetch(`${apiUrl}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData),
        });
    } catch (error) {
        console.error('Error creating project:', error);
    }
};

// Create expense function
const createExpense = async (expenseData) => {
    try {
        await fetch(`${apiUrl}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData),
        });
    } catch (error) {
        console.error('Error creating expense:', error);
    }
};

// Initialize the application by loading all clients
loadClients();
