const todoForm = document.querySelector('form');
const todoInput = document.getElementById('toDoInput');
const todoListUL = document.getElementById('taskList');

let theme = localStorage.getItem("theme");
if (theme === "lightmode") {
    document.body.classList.add("lightmode");
}

let allTodos = loadTodo();
let currentFilter = "all";
updateTodoList();

document.querySelector('[data-filter="all"]').classList.add('active');

todoForm.addEventListener('submit', function(e){
    e.preventDefault();
    addTodo();
})

const filterValues = document.querySelectorAll(".tablink");
for (let i = 0; i < filterValues.length; i++){
    filterValues[i].addEventListener("click", function(e){
        filterValues.forEach(value => value.classList.remove('active'));
        filterValues[i].classList.add('active');
        currentFilter = e.target.dataset.filter;
        updateTodoList();
    })
}

function addTodo(){
    const todoText = todoInput.value.trim();
    if (todoText.length > 0){
        const todoObject = {
            text: todoText,
            completed: false
        }
        allTodos.push(todoObject);
        updateTodoList(todoText);
        saveTodo();
        todoInput.value = "";
    }
}

function updateTodoList(todo){
    todoListUL.innerHTML = "";   
    allTodos.forEach((todo, todoIndex) => {
        if (
            currentFilter === "all" || (currentFilter === "active" && todo.completed === false) || (currentFilter === "completed" && todo.completed === true)
        ) {
            todoItem = createTodoItem(todo, todoIndex);
            todoListUL.append(todoItem);
        }
    })
}

function createTodoItem(todo, todoIndex){
    const todoID = "item"+todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text
    todoLI.className = "taskItems";
    todoLI.innerHTML = `
    <input type="checkbox" id="${todoID}">
    <label for="${todoID}" class="custom-checkbox">
        <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
    </label>
    <label for="${todoID}" class="itemText">
        ${todoText}
    </label>
    <button class="deleteButton">
        <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
    </button>
    `
    const deleteButton = todoLI.querySelector(".deleteButton");
    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todoIndex);
    })

    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", () => {
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodo();
        updateTodoList();
    })
    checkbox.checked = todo.completed;
    return todoLI
}

function saveTodo(){
    const todoJson = JSON.stringify(allTodos);
    localStorage.setItem("todo", todoJson)
}

function loadTodo(){
    const todos = localStorage.getItem("todo") || "[]";
    return JSON.parse(todos);
}

function deleteTodoItem(todoIndex){
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodo();
    updateTodoList();
}

const toggleButton = document.getElementById("themeSwitch");
toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("lightmode");

    if (document.body.classList.contains("lightmode")) {
        localStorage.setItem("theme", "lightmode");
    } else {
        localStorage.setItem("theme", "darkmode");
    }
})

