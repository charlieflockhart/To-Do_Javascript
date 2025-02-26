import { formatDate } from "./utils.js";
import { sortTasksByDate } from "./utils.js";
import { createTaskElement, saveTasks  } from "./taskManager.js";
import { showNotification } from "./notifications.js";


// recycleBin.js - Manages task deletion and restoration


// restoreTask function
// This function restores a task from the recycle bin
// It creates a new task element and appends it to the task list
// It then removes the task from the recycle bin
// It also shows a notification to the user

export function restoreTask(text, completed, recycleItem) {
    const dueDate = recycleItem.getAttribute("data-due-date") || "";
    const taskItem = createTaskElement(text, completed, dueDate);
    taskItem.querySelector(".due-date").textContent = dueDate ? `Due: ${formatDate(dueDate)}` : "";
    taskList.appendChild(taskItem);
    recycleItem.remove();
    saveTasks();
    saveRecycleBin();
    sortTasksByDate();
}



// saveRecycleBin function
// This function saves the tasks in the recycle bin to local storage
// It creates an array of tasks by iterating over the recycle bin
// It then saves the tasks array to local storage

export function saveRecycleBin() {
    const binTasks = [];
    document.querySelectorAll("#recycleBin li").forEach(li => {
        const span = li.querySelector("span");
        const dueDate = li.getAttribute("data-due-date") || "";
        binTasks.push({
            text: span.textContent,
            dueDate: dueDate
        });
    });
    localStorage.setItem("recycleBin", JSON.stringify(binTasks));
}



// loadRecycleBin function
// This function loads the tasks from the recycle bin
// It retrieves the tasks array from local storage
// It then iterates over the tasks array and creates a task element for each task
// It appends the task element to the task list

export function loadRecycleBin() {
    const binTasks = JSON.parse(localStorage.getItem("recycleBin")) || [];
    binTasks.forEach(task => {
        const recycleItem = document.createElement("li");
        recycleItem.innerHTML = `<span>${task.text}</span>`;
        recycleItem.setAttribute("data-due-date", task.dueDate);
        const restoreBtn = document.createElement("button");
        restoreBtn.textContent = "Restore";
        restoreBtn.classList.add("restore-btn");
        restoreBtn.addEventListener("click", () => restoreTask(task.text, false, recycleItem));
        recycleItem.appendChild(restoreBtn);
        recycleBin.appendChild(recycleItem);
    });
}



// Clear recycle bin button
// This event listener clears the recycle bin
// It removes all tasks from the recycle bin
// It also removes the tasks from local storage
// It shows a notification to the user

export function clearRecycleBin() {
    recycleBin.innerHTML = "";
    localStorage.removeItem("recycleBin");
    showNotification("Recycle bin emptied!", "error");
}



// Restore all tasks button
// This function restores all tasks from the recycle bin
// It gets all tasks from the recycle bin
// It restores each task by calling restoreTask
// It shows a notification to the user

export function restoreAllTasks() {
    const recycleItems = [...recycleBin.children];
    recycleItems.forEach(item => {
        const text = item.querySelector("span").textContent;
        restoreTask(text, false, item);
    });
    showNotification("All Tasks restored!", "success");
}
