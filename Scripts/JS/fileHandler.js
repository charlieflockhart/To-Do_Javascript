import { showNotification } from "./notifications.js";

// fileHandler.js - Manages importing and exporting tasks

const buttonContainer = document.getElementById("buttonContainer");



// Create Import button
export const loadTasksBtn = document.createElement("button");
loadTasksBtn.textContent = "Import Tasks";
loadTasksBtn.id = "loadTasksBtn";
buttonContainer.appendChild(loadTasksBtn);



// Add gap between buttons
loadTasksBtn.style.marginRight = "10px";



// Create Export button
export const saveTasksBtn = document.createElement("button");
saveTasksBtn.textContent = "Export Tasks";
saveTasksBtn.id = "saveTasksBtn";
buttonContainer.appendChild(saveTasksBtn);



// Create hidden file input
export const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.id = "fileInput";
fileInput.style.display = "none";
document.body.appendChild(fileInput);



// Export tasks on button click
export function exportTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`;
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `To_Do_Tasks_Exported_${formattedDate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification("Export Successful", "success");
}



// Import tasks on file selection
export function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const tasks = JSON.parse(e.target.result);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            showNotification("Import Successful", "success");
            
            // Delay page reload to allow notification to be visible
            setTimeout(() => {
                location.reload();
            }, 1500);
            
        } catch (error) {
            showNotification("Invalid file format!", "error");
        }
    };
    reader.readAsText(file);
}

