// To-Do List Application

// Task class to represent a task
class Task {
    constructor(id, description) {
        this.id = id;
        this.description = description;
        this.completed = false;
    }
}

class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.filter = 'all'; // all, completed, pending
        this.render();
    }

    addTask(description) {
        const id = Date.now();
        const newTask = new Task(id, description);
        this.tasks.push(newTask);
        this.saveTasks();
        this.render();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.render();
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task => {
            if (task.id === id) task.completed = !task.completed;
            return task;
        });
        this.saveTasks();
        this.render();
    }

    editTask(id, newDescription) {
        this.tasks = this.tasks.map(task => {
            if (task.id === id) task.description = newDescription;
            return task;
        });
        this.saveTasks();
        this.render();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    setFilter(filter) {
        this.filter = filter;
        this.render();
    }

    getFilteredTasks() {
        if (this.filter === 'completed') {
            return this.tasks.filter(task => task.completed);
        } else if (this.filter === 'pending') {
            return this.tasks.filter(task => !task.completed);
        }
        return this.tasks;
    }

    render() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        const filteredTasks = this.getFilteredTasks();

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <input type="checkbox" class="toggle-complete" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                <span class="description ${task.completed ? 'completed' : ''}">${task.description}</span>
                <button class="edit-task" data-id="${task.id}">Edit</button>
                <button class="delete-task" data-id="${task.id}">Delete</button>
            `;
            taskList.appendChild(taskItem);
        });

        // Attach event listeners to buttons
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.querySelectorAll('.toggle-complete').forEach(checkbox => {
            checkbox.addEventListener('change', event => {
                const id = parseInt(event.target.dataset.id, 10);
                this.toggleTask(id);
            });
        });

        document.querySelectorAll('.delete-task').forEach(button => {
            button.addEventListener('click', event => {
                const id = parseInt(event.target.dataset.id, 10);
                this.deleteTask(id);
            });
        });

        document.querySelectorAll('.edit-task').forEach(button => {
            button.addEventListener('click', event => {
                const id = parseInt(event.target.dataset.id, 10);
                const newDescription = prompt('Edit task description:');
                if (newDescription) {
                    this.editTask(id, newDescription);
                }
            });
        });

        document.getElementById('filter-all').addEventListener('click', () => this.setFilter('all'));
        document.getElementById('filter-completed').addEventListener('click', () => this.setFilter('completed'));
        document.getElementById('filter-pending').addEventListener('click', () => this.setFilter('pending'));
    }
}

// Initialize the app
const app = new TodoApp();

document.getElementById('add-task-form').addEventListener('submit', event => {
    event.preventDefault();
    const taskInput = document.getElementById('task-input');
    const description = taskInput.value.trim();
    if (description) {
        app.addTask(description);
        taskInput.value = '';
    }
});

// HTML for the app
const appHtml = `
    <div id="todo-app">
        <h1>To-Do List</h1>
        <form id="add-task-form">
            <input type="text" id="task-input" placeholder="Add a new task">
            <button type="submit">Add</button>
        </form>
        <div id="filters">
            <button id="filter-all">All</button>
            <button id="filter-completed">Completed</button>
            <button id="filter-pending">Pending</button>
        </div>
        <ul id="task-list"></ul>
    </div>
`;

document.body.innerHTML = appHtml;
