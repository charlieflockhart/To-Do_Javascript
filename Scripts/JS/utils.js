// utils.js - Contains utility functions



// formatDate function
// This function takes a date string as an argument
// It creates a new date object from the date string
// It then formats the date object to a short date format
// The function returns the formatted date string

export function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
}



// checkTaskStatus function
// This function takes a due date string as an argument
// It creates a new date object from the due date string
// It then creates a new date object for the current date
// It compares the due date with the current date
// If the due date is equal to the current date, the function returns "today"
// If the due date is less than the current date, the function returns "overdue"
// If the due date is greater than the current date, the function returns "future"

export function checkTaskStatus(dueDate) {
    const taskDate = new Date(dueDate);
    const currentDate = new Date();

    if (taskDate.toDateString() === currentDate.toDateString()) {
        return "today";  
    }
    
    if (taskDate < currentDate) {
        return "overdue";  
    }

    return "future";  
}



// sortTasksByDate function
// This function sorts the tasks by due date
// It gets all the tasks from the task list
// It filters out tasks with a due date and tasks without a due date
// It sorts the tasks with a due date based on the date value
// It combines the sorted tasks with the tasks without a due date
// It then clears the task list and appends the sorted tasks

export function sortTasksByDate() {
    const tasks = [...document.getElementById("taskList").children];
    
    const tasksWithDate = tasks.filter(task => {
        const dueDateText = task.querySelector('.due-date').textContent.trim();
        return dueDateText !== '' && !isNaN(new Date(dueDateText.replace('Due: ', '').trim()).getTime());
    });

    const tasksWithoutDate = tasks.filter(task => task.querySelector('.due-date').textContent.trim() === '');
    
    tasksWithDate.sort((a, b) => {
        const dateA = new Date(a.querySelector('.due-date').textContent.replace('Due: ', '').trim());
        const dateB = new Date(b.querySelector('.due-date').textContent.replace('Due: ', '').trim());
        return dateA - dateB;
    });

    const sortedTasks = [...tasksWithDate, ...tasksWithoutDate];

    document.getElementById("taskList").innerHTML = '';
    sortedTasks.forEach(task => document.getElementById("taskList").appendChild(task));
}