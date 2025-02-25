document.addEventListener("DOMContentLoaded", loadTasks);

// Get elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Filter elements
const allFilter = document.getElementById("allFilter");
const completedFilter = document.getElementById("completedFilter");
const pendingFilter = document.getElementById("pendingFilter");
const dueTodayFilter = document.getElementById("dueTodayFilter");
const overdueFilter = document.getElementById("overdueFilter");

// Notification element
const notificationContainer = document.getElementById("notificationContainer");

// Recycle bin elements
const recycleBin = document.getElementById("recycleBin");
const clearBinBtn = document.getElementById("clearBinBtn");

// Date Input elements
const dueDateInput = document.getElementById("dueDateInput");

// Add event listeners
addTaskBtn.addEventListener("click", addTask);
taskList.addEventListener("click", handleTaskClick);

// Filter event listeners
allFilter.addEventListener("click", () => filterTasks("all"));
completedFilter.addEventListener("click", () => filterTasks("completed"));
pendingFilter.addEventListener("click", () => filterTasks("pending"));
dueTodayFilter.addEventListener("click", () => filterTasks("dueToday"));
overdueFilter.addEventListener("click", () => filterTasks("overdue"));

// Show notification
// This function creates a notification element and appends it to the notification container
// It then removes the notification after 3 seconds
// The function takes a message and a type as arguments
// The type argument is optional and defaults to "success"
// The type argument is used to apply different styles to the notification

function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.classList.add("notification", type);
    notification.textContent = message;

    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000); // Notification disappears after 3 seconds
}

// formatDate function
// This function takes a date string as an argument
// It creates a new date object from the date string
// It then formats the date object to a short date format
// The function returns the formatted date string

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
}

// checkIfOverdue function
// This function takes a due date string as an argument
// It creates a new date object from the due date string
// It then creates a new date object for the current date
// It compares the due date with the current date
// If the due date is less than the current date, the function returns true
function checkIfOverdue(dueDate) {
    const taskDate = new Date(dueDate);
    const currentDate = new Date();
    return taskDate < currentDate;
}

// checkTaskStatus function
// This function takes a due date string as an argument
// It creates a new date object from the due date string
// It then creates a new date object for the current date
// It compares the due date with the current date
// If the due date is equal to the current date, the function returns "today"
// If the due date is less than the current date, the function returns "overdue"
// If the due date is greater than the current date, the function returns "future"

function checkTaskStatus(dueDate) {
    const taskDate = new Date(dueDate);
    const currentDate = new Date();
    
    // Check if the task is due today
    if (taskDate.toDateString() === currentDate.toDateString()) {
        return "today";  // Task is due today
    }
    
    // Check if the task is overdue
    if (taskDate < currentDate) {
        return "overdue";  // Task is overdue
    }

    return "future";  // Task is in the future
}

// sortTasksByDate function
// This function sorts the tasks by due date
// It gets all the tasks from the task list
// It filters out tasks with a due date and tasks without a due date
// It sorts the tasks with a due date based on the date value
// It combines the sorted tasks with the tasks without a due date
// It then clears the task list and appends the sorted tasks

function sortTasksByDate() {
    const tasks = [...taskList.children];
    
    // Filter out tasks with a due date and tasks without one
    const tasksWithDate = tasks.filter(task => {
        const dueDateText = task.querySelector('.due-date').textContent.trim();
        return dueDateText !== '' && !isNaN(new Date(dueDateText.replace('Due: ', '').trim()).getTime());
    });
    const tasksWithoutDate = tasks.filter(task => task.querySelector('.due-date').textContent.trim() === '');
    
    // Sort tasks with a due date based on the date value
    tasksWithDate.sort((a, b) => {
        const dateA = new Date(a.querySelector('.due-date').textContent.replace('Due: ', '').trim());
        const dateB = new Date(b.querySelector('.due-date').textContent.replace('Due: ', '').trim());
        return dateA - dateB;
    });
    
    // Combine sorted tasks with the tasks without a date at the bottom
    const sortedTasks = [...tasksWithDate, ...tasksWithoutDate];
    
    // Clear the task list and append the sorted tasks
    taskList.innerHTML = '';
    sortedTasks.forEach(task => taskList.appendChild(task));
}

// This function adds a task to the task list
// It creates a new task element and appends it to the task list
// It also saves the tasks to local storage

function addTask() {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value.trim(); // Get the due date

    if (taskText === "") return;

    const taskItem = createTaskElement(taskText, false, dueDate);
    taskList.appendChild(taskItem);
    saveTasks();

    showNotification("Task added!", "success");

    taskInput.value = "";
    dueDateInput.value = ""; // Clear the date input

    sortTasksByDate(); // Sort tasks after adding
}

// Add task on Enter key press
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// This function creates a new task element
// It creates a new li element and appends a span and a delete button to it
// The span contains the task text and the delete button allows the user to delete the task
// The span also has a click event listener that toggles the completed class
// The delete button has a click event listener that removes the task from the task list
// The function returns the li element

function createTaskElement(text, completed = false, dueDate = "") {
    const li = document.createElement("li");
    
    // Add animation class
    li.classList.add("task-item"); 

    const span = document.createElement("span");
    span.textContent = text;
    span.addEventListener("click", () => completeTask(span));// Click to complete

    span.addEventListener("dblclick", () => editTask(span)); // Double-click to edit

    const dueDateSpan = document.createElement("span");
    dueDateSpan.classList.add("due-date");

    if (dueDate) {
        dueDateSpan.textContent = `Due: ${formatDate(dueDate)}`;
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
    });

    li.appendChild(span);
    li.appendChild(dueDateSpan);
    li.appendChild(deleteBtn);

    // Enable dragging
    li.setAttribute("draggable", "true");
    li.classList.add("draggable");

    // Enable dragging
    li.addEventListener("dragstart", () => li.classList.add("dragging"));
    li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
        saveTasks();
    });

    return li;
}


// This function removes a task from the task list
// It adds a removing class to the task
// It then removes the task from the task list after the fade-out animation
// The function also saves the tasks to local storage

function removeTask(taskItem) {
    const taskText = taskItem.querySelector("span").textContent;
    const isCompleted = taskItem.querySelector("span").classList.contains("completed");
    const dueDate = taskItem.querySelector(".due-date").textContent.replace("Due: ", "");

    // Create a recycle bin entry
    const recycleItem = document.createElement("li");
    recycleItem.innerHTML = `<span>${taskText}</span>`;
    recycleItem.setAttribute("data-due-date", dueDate);

    const restoreBtn = document.createElement("button");
    restoreBtn.textContent = "Restore";
    restoreBtn.classList.add("restore-btn");
    restoreBtn.addEventListener("click", () => restoreTask(taskText, isCompleted, recycleItem));

    recycleItem.appendChild(restoreBtn);
    recycleBin.appendChild(recycleItem);

    // Remove from the main list
    taskItem.classList.add("removing"); // Apply fade-out animation
    setTimeout(() => {
        taskItem.remove();
        saveTasks();
        showNotification("Task deleted and moved to recycle bin!", "error");
    }, 300); // Match timeout to CSS animation duration
}

// Drag & Drop functionality
// This function allows the user to drag and drop tasks
// It adds a dragover event listener to the task list
// It gets the dragging element and the siblings of the dragging element
// It then finds the closest sibling to the dragging element
// If the closest sibling is found, it inserts the dragging element before the closest sibling
// If the closest sibling is not found, it appends the dragging element to the task list

taskList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const draggingElement = document.querySelector(".dragging");
    const siblings = [...taskList.querySelectorAll(".draggable:not(.dragging)")];

    let closest = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    siblings.forEach((sibling) => {
        const box = sibling.getBoundingClientRect();
        const offset = e.clientY - box.top - box.height / 2;
        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closest = sibling;
        }
    });

    if (closest) {
        taskList.insertBefore(draggingElement, closest);
    } else {
        taskList.appendChild(draggingElement);
    }
});

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

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.completed, task.dueDate);
        taskList.appendChild(taskItem);
    });

    sortTasksByDate();  // Sort tasks after loading them
}

// This function completes a task
// It toggles the completed class on the task element
// It then saves the tasks to local storage
// It also shows a notification to the user

function completeTask(span) {
    span.classList.toggle("completed");
    saveTasks();
    
    if (span.classList.contains("completed")) {
        showNotification("Task completed!", "info");
    } else {
        showNotification("Task marked as pending!", "info");
    }

    filterTasks(document.querySelector(".active-filter")?.id || "all");
}

// This function handles the click events on the task list
// If the delete button is clicked, it removes the task from the task list
// It then saves the tasks to local storage

function handleTaskClick(event) {
    if (event.target.classList.contains("delete-btn")) {
        // Remove task
        removeTask(event.target.parentElement);
    }
}


// This function filters the tasks based on the filter type
// It hides or shows tasks based on the filter type
// It also adds the active-filter class to the selected filter button
function filterTasks(filter) {
    // Remove active-filter class from all filter buttons
    document.querySelectorAll(".filter-buttons button").forEach(btn => btn.classList.remove("active-filter"));
    
    // Add active-filter class to the selected filter button
    document.getElementById(`${filter}Filter`).classList.add("active-filter");

    // Filter tasks based on the selected filter
    document.querySelectorAll("#taskList li").forEach(li => {
        const isCompleted = li.querySelector("span").classList.contains("completed");
        const dueDateSpan = li.querySelector(".due-date");
        const dueDate = dueDateSpan ? dueDateSpan.textContent.replace("Due: ", "") : "";

        if (filter === "completed" && !isCompleted) {
            li.style.display = "none";
        } else if (filter === "pending" && isCompleted) {
            li.style.display = "none";
        } else if (filter === "dueToday" && checkTaskStatus(dueDate) !== "today") {
            li.style.display = "none";
        } else if (filter === "overdue" && checkTaskStatus(dueDate) !== "overdue") {
            li.style.display = "none";
        } else {
            li.style.display = "flex";
        }
    });
}

// RECYCLE BIN FUNCTIONALITY
//
//
//
//

// restoreTask function
// This function restores a task from the recycle bin
// It creates a new task element and appends it to the task list
// It then removes the task from the recycle bin
// It also shows a notification to the user

function restoreTask(text, completed, recycleItem) {
    const dueDate = recycleItem.getAttribute("data-due-date") || "";
    const taskItem = createTaskElement(text, completed, dueDate);
    taskItem.querySelector(".due-date").textContent = dueDate ? `Due: ${formatDate(dueDate)}` : "";
    taskList.appendChild(taskItem);

    recycleItem.remove();
    showNotification("Task restored!", "success");

    saveTasks();
    saveRecycleBin();
    sortTasksByDate(); // Sort tasks after restoring
}

// saveRecycleBin function
// This function saves the tasks in the recycle bin to local storage
// It creates an array of tasks by iterating over the recycle bin
// It then saves the tasks array to local storage

function saveRecycleBin() {
    const binTasks = [];
    document.querySelectorAll("#recycleBin li span").forEach(span => {
        binTasks.push(span.textContent);
    });
    localStorage.setItem("recycleBin", JSON.stringify(binTasks));
}

// loadRecycleBin function
// This function loads the tasks from the recycle bin
// It retrieves the tasks array from local storage
// It then iterates over the tasks array and creates a task element for each task
// It appends the task element to the task list

function loadRecycleBin() {
    const binTasks = JSON.parse(localStorage.getItem("recycleBin")) || [];
    binTasks.forEach(text => {
        const recycleItem = document.createElement("li");
        recycleItem.innerHTML = `<span>${text}</span>`;
        
        const restoreBtn = document.createElement("button");
        restoreBtn.textContent = "Restore";
        restoreBtn.classList.add("restore-btn");
        restoreBtn.addEventListener("click", () => restoreTask(text, false, recycleItem));

        recycleItem.appendChild(restoreBtn);
        recycleBin.appendChild(recycleItem);
    });
}

// Clear recycle bin button
// This event listener clears the recycle bin
// It removes all tasks from the recycle bin
// It also removes the tasks from local storage
// It shows a notification to the user

clearBinBtn.addEventListener("click", () => {
    recycleBin.innerHTML = "";
    localStorage.removeItem("recycleBin");
    showNotification("Recycle bin emptied!", "error");
});

document.addEventListener("DOMContentLoaded", loadRecycleBin);