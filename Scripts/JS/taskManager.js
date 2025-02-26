import { formatDate, checkTaskStatus } from "./utils.js";
import { sortTasksByDate } from "./utils.js";
import { showNotification } from "./notifications.js";
import { saveRecycleBin, restoreTask } from "./recycleBin.js";
import { filterTasks } from "./filters.js";




// taskManager.js - Manages task creation, editing, deletion, and storage



// This function creates a new task element
// It creates a new li element and appends a span and a delete button to it
// The span contains the task text and the delete button allows the user to delete the task
// The span also has a click event listener that toggles the completed class
// The delete button has a click event listener that removes the task from the task list
// The function returns the li element

export function createTaskElement(text, completed = false, dueDate = "") {
    const li = document.createElement("li");
    li.classList.add("task-item");

    const span = document.createElement("span");
    span.textContent = text;
    span.addEventListener("click", () => completeTask(span));
    span.addEventListener("dblclick", () => editTask(span));

    const dueDateSpan = document.createElement("span");
    dueDateSpan.classList.add("due-date");
    dueDateSpan.textContent = dueDate ? `Due: ${formatDate(dueDate)}` : "";
    dueDateSpan.addEventListener("dblclick", () => editDueDate(dueDateSpan, li));

    if (dueDate) {
        const taskStatus = checkTaskStatus(dueDate);
        if (taskStatus === "overdue") {
            li.classList.add("overdue");
        } else if (taskStatus === "today") {
            li.classList.add("due-today");
        }
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeTask(li);
        showNotification("Task deleted and moved to recycle bin!", "error");
    });

    li.appendChild(span);
    li.appendChild(dueDateSpan);
    li.appendChild(deleteBtn);

    li.setAttribute("draggable", "true");
    li.classList.add("draggable");

    li.addEventListener("dragstart", () => li.classList.add("dragging"));
    li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
        saveTasks();
    });

    return li;
}



// This function adds a task to the task list
// It creates a new task element and appends it to the task list
// It also saves the tasks to local storage

export function addTask() {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value.trim();
    if (taskText === "") {
        showNotification("Please enter a valid task name", "error");
        return;
    }
    const taskItem = createTaskElement(taskText, false, dueDate);
    taskList.appendChild(taskItem);
    saveTasks();
    showNotification("Task added!", "success");
    taskInput.value = "";
    dueDateInput.value = "";
    sortTasksByDate();
}

// Add task on Enter key press
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});



// This function handles the click events on the task list
// If the delete button is clicked, it removes the task from the task list
// It then saves the tasks to local storage

export function handleTaskClick(event) {
    if (event.target.classList.contains("delete-btn")) {
        removeTask(event.target.parentElement);
    }
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
export function saveEdit(input, taskSpan) {
    const newText = input.value.trim();
    if (!newText) return;
    
    // Prevent duplicate execution by delaying blur event
    setTimeout(() => {
        if (input.parentNode) {
            input.replaceWith(taskSpan);
        }
        taskSpan.textContent = newText;
        saveTasks();
    }, 10);
}



// This function completes a task
// It toggles the completed class on the task element
// It then saves the tasks to local storage
// It also shows a notification to the user

export function completeTask(span) {
    span.classList.toggle("completed");
    saveTasks();

    if (span.classList.contains("completed")) {
        showNotification("Task completed!", "info");
    } else {
        showNotification("Task marked as pending!", "info");
    }

    filterTasks(document.querySelector(".active-filter")?.id || "all");
}



// This function removes a task from the task list
// It adds a removing class to the task
// It then removes the task from the task list after the fade-out animation
// The function also saves the tasks to local storage

export function removeTask(taskItem) {
    const taskText = taskItem.querySelector("span").textContent;
    const isCompleted = taskItem.querySelector("span").classList.contains("completed");
    const dueDate = taskItem.querySelector(".due-date").textContent.replace("Due: ", "");
    const recycleItem = document.createElement("li");
    recycleItem.innerHTML = `<span>${taskText}</span>`;
    recycleItem.setAttribute("data-due-date", dueDate);
    const restoreBtn = document.createElement("button");
    restoreBtn.textContent = "Restore";
    restoreBtn.classList.add("restore-btn");
    restoreBtn.addEventListener("click", () => {
        restoreTask(taskText, isCompleted, recycleItem);
        showNotification("Task restored!", "success");
    });
    recycleItem.appendChild(restoreBtn);
    recycleBin.appendChild(recycleItem);
    taskItem.classList.add("removing");
    setTimeout(() => {
        taskItem.remove();
        saveTasks();
        saveRecycleBin();
    }, 300);
}



// This function deletes all tasks from the task list
// It loops through all tasks and moves them to the recycle bin
// It also saves the tasks to local storage and shows a notification to the user

export function deleteAllTasks() {
    const tasks = [...document.getElementById("taskList").children].filter(task => task.style.display !== "none");
    tasks.forEach(task => removeTask(task));
    showNotification("All visible tasks deleted and moved to recycle bin!", "error");
    saveTasks();
    saveRecycleBin();
}



// This function saves the tasks to local storage
// It creates an array of tasks by iterating over the task list
// It then saves the tasks array to local storage

export function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        const span = li.querySelector("span");
        const dueDateSpan = li.querySelector(".due-date");
        tasks.push({
            text: span.textContent,
            completed: span.classList.contains("completed"),
            dueDate: dueDateSpan ? dueDateSpan.textContent.replace("Due: ", "") : "",
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}



// This function loads the tasks from local storage
// It retrieves the tasks array from local storage
// It then iterates over the tasks array and creates a task element for each task
// It appends the task element to the task list

export function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.completed, task.dueDate);
        taskList.appendChild(taskItem);
    });
    sortTasksByDate();
}



// editDueDate function
// This function allows the user to edit the due date of a task
// It replaces the span element with an input element
// The input element contains the due date and has a focus event listener
// The input element also has blur and keypress event listeners to save the edited due date
// The function saves the edited due date to local storage

export function editDueDate(dueDateSpan, taskItem) {
    const oldDate = dueDateSpan.textContent.replace("Due: ", "").trim();
    const input = document.createElement("input");
    input.type = "date";
    input.value = oldDate ? new Date(oldDate).toISOString().split("T")[0] : "";
    input.classList.add("edit-date-input");

    dueDateSpan.replaceWith(input);
    input.focus();

    // Use a flag to track if Enter was pressed
    let enterPressed = false;

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            enterPressed = true;
            saveDueDate(input, dueDateSpan, taskItem);
        }
    });

    input.addEventListener("blur", () => {
        setTimeout(() => {
            if (!enterPressed) {
                saveDueDate(input, dueDateSpan, taskItem);
            }
        }, 10); // Delay blur execution slightly
    });
}



// saveDueDate function
// This function saves the edited due date
// It gets the new date from the input element
// If the new date is empty, it returns
// It then replaces the input element with the new date
// The function then saves the tasks to local storage

export function saveDueDate(input, dueDateSpan, taskItem) {
    const newDate = input.value;
    if (!newDate) return;

    dueDateSpan.textContent = `Due: ${formatDate(newDate)}`;

    // Remove event listeners before replacing the element
    input.removeEventListener("blur", saveDueDate);
    input.removeEventListener("keypress", handleEnterPress);

    if (input.parentNode) {
        input.replaceWith(dueDateSpan);
    }

    updateTaskStatus(taskItem, newDate);
    saveTasks();
    sortTasksByDate();
}

// Helper function to handle Enter key
function handleEnterPress(event) {
    if (event.key === "Enter") {
        saveDueDate(event.target, event.target.previousElementSibling, event.target.closest("li"));
    }
}



// This function updates the task status based on the due date
// It removes the overdue and due-today classes from the task element
// It then checks the task status and adds the appropriate class to the task element

export function updateTaskStatus(taskItem, dueDate) {
    taskItem.classList.remove("overdue", "due-today");

    const status = checkTaskStatus(dueDate);
    if (status === "overdue") {
        taskItem.classList.add("overdue");
    } else if (status === "today") {
        taskItem.classList.add("due-today");
    }
}