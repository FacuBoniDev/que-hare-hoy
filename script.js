document.addEventListener('DOMContentLoaded', () => {
    const newTodoInput = document.getElementById('newTodo');
    const addTodoButton = document.getElementById('addTodo');
    const todoList = document.getElementById('todoList');
    const completedList = document.getElementById('completedList');
    const clearCompletedButton = document.getElementById('clearCompleted');

    let todos = [];
    let completedTodos = [];

    function addTodo() {
        const todoText = newTodoInput.value.trim();
        if (todoText !== '') {
            const todo = { id: Date.now(), text: todoText, completed: false };
            todos.push(todo);
            renderTodos();
            newTodoInput.value = '';
        }
    }

    function toggleTodo(id, isCompleted) {
        if (isCompleted) {
            const todo = completedTodos.find(t => t.id === id);
            if (todo) {
                todo.completed = false;
                delete todo.completedAt;
                todos.push(todo);
                completedTodos = completedTodos.filter(t => t.id !== id);
            }
        } else {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = true;
                todo.completedAt = new Date();
                completedTodos.push(todo);
                todos = todos.filter(t => t.id !== id);
            }
        }
        renderTodos();
    }

    function deleteTodo(id, isCompleted) {
        if (isCompleted) {
            completedTodos = completedTodos.filter(t => t.id !== id);
        } else {
            todos = todos.filter(t => t.id !== id);
        }
        renderTodos();
    }

    function clearCompletedTodos() {
        completedTodos = [];
        renderTodos();
    }

    function formatDate(date) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        return date.toLocaleDateString('es-ES', options);
    }

    function renderTodos() {
        todoList.innerHTML = '';
        completedList.innerHTML = '';

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.innerHTML = `
                <label class="container">
                    <input type="checkbox" id="todo-${todo.id}" ${todo.completed ? 'checked' : ''}>
                    <span class="checkmark"></span>
                    ${todo.text}
                </label>
                <button class="remove-btn" aria-label="Eliminar tarea">X</button>
            `;
            li.querySelector('input').addEventListener('change', () => toggleTodo(todo.id, false));
            li.querySelector('.remove-btn').addEventListener('click', () => deleteTodo(todo.id, false));
            todoList.appendChild(li);
        });

        completedTodos.forEach(todo => {
            const li = document.createElement('li');
            li.innerHTML = `
                <label class="container">
                    <input type="checkbox" id="completed-${todo.id}" checked>
                    <span class="checkmark"></span>
                    ${todo.text}
                </label>
                <span class="completion-time">Completada el: ${formatDate(todo.completedAt)}</span>
                <button class="delete-btn" aria-label="Borrar tarea completada">Borrar</button>
            `;
            const checkbox = li.querySelector('input');
            checkbox.addEventListener('change', () => toggleTodo(todo.id, true));
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id, true));
            completedList.appendChild(li);
        });

        clearCompletedButton.style.display = completedTodos.length > 0 ? 'block' : 'none';
    }

    addTodoButton.addEventListener('click', addTodo);
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    clearCompletedButton.addEventListener('click', clearCompletedTodos);

    renderTodos();
});