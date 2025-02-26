// notifications.js - Manages user notifications


// Show notification
// This function creates a notification element and appends it to the notification container
// It then removes the notification after 3 seconds
// The function takes a message and a type as arguments
// The type argument is optional and defaults to "success"
// The type argument is used to apply different styles to the notification

export function showNotification(message, type = "success") {
    // Remove existing notification if any
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.classList.add("notification", type);
    notification.textContent = message;

    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Make it available globally
window.showNotification = showNotification;
