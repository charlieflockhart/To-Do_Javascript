// dragDrop.js - Handles drag-and-drop functionality



// Drag & Drop functionality
// This function allows the user to drag and drop tasks
// It adds a dragover event listener to the task list
// It gets the dragging element and the siblings of the dragging element
// It then finds the closest sibling to the dragging element
// If the closest sibling is found, it inserts the dragging element before the closest sibling
// If the closest sibling is not found, it appends the dragging element to the task list

export function handleDragOver(event) {
    event.preventDefault();
    const draggingElement = document.querySelector(".dragging");
    const siblings = [...taskList.querySelectorAll(".draggable:not(.dragging)")];
    let closest = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    siblings.forEach((sibling) => {
        const box = sibling.getBoundingClientRect();
        const offset = event.clientY - box.top - box.height / 2;
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
}
