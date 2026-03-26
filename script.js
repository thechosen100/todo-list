const todoForm = document.querySelector('form');
const todoInput = document.getElementById('toDoInput');
const todoListUL = document.getElementById('taskList');

const toggleButton = document.getElementById("themeSwitch");

let theme = localStorage.getItem("theme");
if (theme === "lightmode") {
    document.body.classList.add("lightmode");
    toggleButton.checked = true;
}

toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("lightmode");

    if (document.body.classList.contains("lightmode")) {
        localStorage.setItem("theme", "lightmode");
    } else {
        localStorage.setItem("theme", "darkmode");
    }
})

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
    <button class="editButton">
    <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
    </button>
    <button class="deleteButton">
        <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
    </button>
    `
    const deleteButton = todoLI.querySelector(".deleteButton");
    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todoIndex);
    })

    const editButton = todoLI.querySelector(".editButton");
    editButton.addEventListener("click", () => {
        console.log("Edit button clicked");
        editTodoItem(todoLI, todoIndex);
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

function editTodoItem(todoLI, todoIndex){
    //need to make changes here right now
    //ionno what the logic is
    //convert the checkbox whos edit button is clicked into a text input with "change" button at the end
    const todo = allTodos[todoIndex];

    todoLI.innerHTML = `
    <input type="text" class="editInput" value="${todo.text}">
    <button class="saveButton">Save</button>
    `

    const input = todoLI.querySelector(".editInput");
    const saveButton = todoLI.querySelector(".saveButton");

    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    saveButton.addEventListener("click", () => {
        const newText = input.value.trim();
        if (newText.length > 0) {
            allTodos[todoIndex].text = newText;
            saveTodo();
            updateTodoList();
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            saveButton.click();
        }
    });
}
