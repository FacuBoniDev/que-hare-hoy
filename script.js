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

// Función para obtener las tareas guardadas en localStorage
function obtenerTareas() {
    const tareasGuardadas = localStorage.getItem('tareas');
    return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
}

// Función para obtener las tareas completadas guardadas en localStorage
function obtenerTareasCompletadas() {
    const tareasCompletadasGuardadas = localStorage.getItem('tareasCompletadas');
    return tareasCompletadasGuardadas ? JSON.parse(tareasCompletadasGuardadas) : [];
}

// Función para guardar las tareas pendientes en localStorage
function guardarTareas(tareas) {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

// Función para guardar las tareas completadas en localStorage
function guardarTareasCompletadas(tareasCompletadas) {
    localStorage.setItem('tareasCompletadas', JSON.stringify(tareasCompletadas));
}

// Función para cargar las tareas almacenadas al iniciar la página
window.onload = function() {
    // Obtener y renderizar tareas pendientes
    const tareas = obtenerTareas();
    const listaTareas = document.getElementById('todoList');
    tareas.forEach((tarea) => {
        agregarTareaHTML(tarea); // Asumiendo que ya tienes una función que agrega la tarea a la UI
    });

    // Obtener y renderizar tareas completadas
    const tareasCompletadas = obtenerTareasCompletadas();
    const listaCompletadas = document.getElementById('completedList');
    tareasCompletadas.forEach((tarea) => {
        agregarTareaCompletadaHTML(tarea); // Asumiendo que ya tienes una función para agregar a la lista de completadas
    });
}

// Asegúrate de que estas funciones se ejecuten al añadir o completar tareas:

// Después de añadir una nueva tarea:
function agregarTarea(nombreTarea) {
    const tareas = obtenerTareas();
    tareas.push(nombreTarea);
    guardarTareas(tareas);  // Guardar tareas actualizadas
}

// Después de completar una tarea:
function completarTarea(index) {
    const tareas = obtenerTareas();
    const tareaCompletada = tareas.splice(index, 1)[0]; // Remover de la lista de pendientes
    guardarTareas(tareas);  // Actualizar la lista de tareas pendientes

    const tareasCompletadas = obtenerTareasCompletadas();
    tareasCompletadas.push(tareaCompletada);  // Añadir a la lista de completadas
    guardarTareasCompletadas(tareasCompletadas);  // Guardar las completadas
}

// Borrar todas las tareas completadas
function borrarTareasCompletadas() {
    localStorage.removeItem('tareasCompletadas');  // Borrar tareas completadas de localStorage
}
