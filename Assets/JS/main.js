// main.js - Initializes the app and handles event listeners
import { addTask, loadTasks, handleTaskClick, deleteAllTasks, editDueDate } from './taskManager.js';
import { filterTasks } from './filters.js';
import { handleDragOver } from './dragDrop.js';
import { loadTasksBtn, saveTasksBtn, fileInput, exportTasks, importTasks } from './fileHandler.js';
import { loadRecycleBin, restoreAllTasks, clearRecycleBin } from './recycleBin.js';


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("taskList").addEventListener("click", handleTaskClick);
    document.getElementById("deleteAllBtn").addEventListener("click", deleteAllTasks);

    loadTasksBtn.addEventListener("click", () => fileInput.click()); // Opens file input dialog
    fileInput.addEventListener("change", importTasks); // Handles file import
    saveTasksBtn.addEventListener("click", exportTasks); // Exports tasks

    // Load tasks and recycle bin
    loadTasks();
    loadRecycleBin();

    // Random Listeners
    addTaskBtn.addEventListener("click", addTask);
    taskList.addEventListener("click", handleTaskClick);
    deleteAllBtn.addEventListener("click", deleteAllTasks);
    clearBinBtn.addEventListener("click", clearRecycleBin);
    restoreAllBinBtn.addEventListener("click", restoreAllTasks);
    fileInput.addEventListener("change", importTasks);

    // Filter event listeners
    allFilter.addEventListener("click", () => filterTasks("all"));
    completedFilter.addEventListener("click", () => filterTasks("completed"));
    pendingFilter.addEventListener("click", () => filterTasks("pending"));
    dueTodayFilter.addEventListener("click", () => filterTasks("dueToday"));
    overdueFilter.addEventListener("click", () => filterTasks("overdue"));

    // Drag and drop initialization
    taskList.addEventListener("dragover", handleDragOver);
});