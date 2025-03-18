// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const todoList = document.getElementById('todoList');
const taskCount = document.getElementById('taskCount');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompleted');
const priorityFilter = document.getElementById('priorityFilter');

// State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';
let currentPriority = 'all';

// Save todos to localStorage
const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateTaskCount();
};

// Create new todo
const createTodo = (text) => {
    const priority = getPriorityFromText(text);
    const todo = {
        id: Date.now(),
        text: text.replace(/!h|!m|!l/gi, '').trim(), // Remove priority markers
        completed: false,
        priority: priority,
        createdAt: new Date()
    };
    todos.unshift(todo);
    saveTodos();
    renderTodos();
};

// Get priority from text (!h = high, !m = medium, !l = low)
const getPriorityFromText = (text) => {
    if (text.includes('!h')) return 'high';
    if (text.includes('!m')) return 'medium';
    if (text.includes('!l')) return 'low';
    return 'medium';
};

// Delete todo
const deleteTodo = (id) => {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
};

// Toggle todo completion
const toggleTodo = (id) => {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
};

// Edit todo
const editTodo = (id, newText) => {
    const priority = getPriorityFromText(newText);
    todos = todos.map(todo =>
        todo.id === id ? { 
            ...todo, 
            text: newText.replace(/!h|!m|!l/gi, '').trim(),
            priority: priority
        } : todo
    );
    saveTodos();
    renderTodos();
};

// Create todo element
const createTodoElement = (todo) => {
    const li = document.createElement('li');
    li.className = `todo-item priority-${todo.priority}`;
    if (todo.completed) li.classList.add('completed');

    li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${todo.text}</span>
        <div class="todo-actions">
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;

    // Event Listeners
    const checkbox = li.querySelector('.todo-checkbox');
    const deleteBtn = li.querySelector('.delete-btn');
    const editBtn = li.querySelector('.edit-btn');
    const todoText = li.querySelector('.todo-text');

    checkbox.addEventListener('change', () => toggleTodo(todo.id));
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    
    editBtn.addEventListener('click', () => {
        const newText = prompt('Edit task:', todo.text);
        if (newText !== null && newText.trim() !== '') {
            editTodo(todo.id, newText);
        }
    });

    return li;
};

// Filter todos
const filterTodos = () => {
    return todos.filter(todo => {
        const matchesFilter = 
            currentFilter === 'all' ? true :
            currentFilter === 'active' ? !todo.completed :
            currentFilter === 'completed' ? todo.completed : true;

        const matchesPriority =
            currentPriority === 'all' ? true :
            todo.priority === currentPriority;

        return matchesFilter && matchesPriority;
    });
};

// Render todos
const renderTodos = () => {
    const filteredTodos = filterTodos();
    todoList.innerHTML = '';
    filteredTodos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });
};

// Update task count
const updateTaskCount = () => {
    const activeTodos = todos.filter(todo => !todo.completed).length;
    taskCount.textContent = `${activeTodos} task${activeTodos !== 1 ? 's' : ''} left`;
};

// Event Listeners
addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) {
        createTodo(text);
        taskInput.value = '';
    }
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const text = taskInput.value.trim();
        if (text) {
            createTodo(text);
            taskInput.value = '';
        }
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

priorityFilter.addEventListener('change', (e) => {
    currentPriority = e.target.value;
    renderTodos();
});

clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
});

// Initial render
renderTodos(); 