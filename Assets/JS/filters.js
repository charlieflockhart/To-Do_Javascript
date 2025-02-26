import { checkTaskStatus } from "./utils.js";


// filters.js - Handles task filtering based on completion status and due dates



// This function filters the tasks based on the filter type
// It hides or shows tasks based on the filter type
// It also adds the active-filter class to the selected filter button

export function filterTasks(filter) {
    // Ensure the filter button exists before adding the active class
    const filterButton = document.getElementById(`${filter}Filter`);
    if (filterButton) {
        document.querySelectorAll(".filter-buttons button").forEach(btn => btn.classList.remove("active-filter"));
        filterButton.classList.add("active-filter");
    }

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

