document.addEventListener("DOMContentLoaded", loadTasks);

// Get elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Filter elements
const allFilter = document.getElementById("allFilter");
const completedFilter = document.getElementById("completedFilter");
const pendingFilter = document.getElementById("pendingFilter");

// Add event listeners
addTaskBtn.addEventListener("click", addTask);
taskList.addEventListener("click", handleTaskClick);

// Filter event listeners
allFilter.addEventListener("click", () => filterTasks("all"));
completedFilter.addEventListener("click", () => filterTasks("completed"));
pendingFilter.addEventListener("click", () => filterTasks("pending"));


// This function adds a task to the task list
// It creates a new task element and appends it to the task list
// It also saves the tasks to local storage

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const taskItem = createTaskElement(taskText);
    taskList.appendChild(taskItem);
    saveTasks();

    taskInput.value = "";
}



// This function creates a new task element
// It creates a new li element and appends a span and a delete button to it
// The span contains the task text and the delete button allows the user to delete the task
// The span also has a click event listener that toggles the completed class
// The delete button has a click event listener that removes the task from the task list
// The function returns the li element

function createTaskElement(text) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = text;
    span.addEventListener("click", () => {
        span.classList.toggle("completed");
        saveTasks();
    });

    span.addEventListener("dblclick", () => editTask(span)); // Double-click to edit

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
        li.remove();
        saveTasks();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    return li;
}

// This function allows the user to edit a task
// It replaces the span element with an input element
// The input element contains the task text and has a focus event listener
// The input element also has blur and keypress event listeners to save the edited task
// The function saves the edited task to local storage

function editTask(span) {
    const oldText = span.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.value = oldText;
    input.classList.add("edit-input");

    span.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => saveEdit(input, span)); // Save on focus out
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") saveEdit(input, span); // Save on Enter key press
    });
}

// This function saves the edited task
// It gets the new text from the input element
// If the new text is empty, it returns
// It then replaces the span element with the new text
// The function then saves the tasks to local storage
function saveEdit(input, span) {
    const newText = input.value.trim();
    if (newText === "") return;

    span.textContent = newText;
    input.replaceWith(span);
    saveTasks();
}


// This function saves the tasks to local storage
// It creates an array of tasks by iterating over the task list
// It then saves the tasks array to local storage

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li span").forEach(span => {
        tasks.push({ text: span.textContent, completed: span.classList.contains("completed") });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}



// This function loads the tasks from local storage
// It retrieves the tasks array from local storage
// It then iterates over the tasks array and creates a task element for each task
// It appends the task element to the task list

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text);
        if (task.completed) taskItem.querySelector("span").classList.add("completed");
        taskList.appendChild(taskItem);
    });
}



// This function handles the click events on the task list
// If the delete button is clicked, it removes the task from the task list
// It then saves the tasks to local storage

function handleTaskClick(event) {
    if (event.target.classList.contains("delete-btn")) {
        event.target.parentElement.remove();
        saveTasks();
    }
}


// This function filters the tasks based on the filter type
// It hides or shows tasks based on the filter type
// It also adds the active-filter class to the selected filter button
function filterTasks(filter) {
    document.querySelectorAll(".filter-buttons button").forEach(btn => btn.classList.remove("active-filter"));
    document.getElementById(`${filter}Filter`).classList.add("active-filter");

    document.querySelectorAll("#taskList li").forEach(li => {
        const isCompleted = li.querySelector("span").classList.contains("completed");

        if (filter === "completed" && !isCompleted) {
            li.style.display = "none";
        } else if (filter === "pending" && isCompleted) {
            li.style.display = "none";
        } else {
            li.style.display = "flex";
        }
    });
}