// =========================
// CLOCK FUNCTIONALITY
// =========================

// Updates the clock every second
function updateClock() {
  const now = new Date(); // Get current time
  updateFlip("hours", now.getHours());   // Update hours display
  updateFlip("minutes", now.getMinutes()); // Update minutes display
  updateFlip("seconds", now.getSeconds()); // Update seconds display
}

// Updates the flip animation for the clock numbers
function updateFlip(id, value) {
  const el = document.getElementById(id); // Select the element by ID
  const span = el.querySelector("span");  // Select the span containing the number
  const newValue = String(value).padStart(2, "0"); // Format to 2 digits

  // Update only if the displayed value changes
  if (span.textContent !== newValue) {
    span.textContent = newValue;
    span.style.animation = "none";        // Reset animation
    void span.offsetWidth;                // Trigger browser reflow (restarts animation)
    span.style.animation = "flip 0.5s ease"; // Apply flip animation
  }
}

// Updates the date display
function updateDate() {
  const now = new Date(); // Get current date
  const options = { weekday: "long", month: "long", day: "numeric" };
  // Format: e.g., "Saturday, August 2"
  document.getElementById("date").textContent = now.toLocaleDateString("en-US", options);
}

// Start clock & date updates
setInterval(updateClock, 1000); // Refresh clock every second
updateClock(); // Initial clock update
updateDate();  // Initial date update


// =========================
// TO-DO LIST FUNCTIONALITY
// =========================

// Select input/button and sections for tasks
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const newTaskHead = document.querySelector(".new-task-head");
const completedTaskHead = document.querySelector(".completed-task-head");

// Creates a single task element (either new or completed)
function createTaskElement(taskText, completed = false) {
  const taskDiv = document.createElement("div");
  taskDiv.classList.add(completed ? "completed-tasks" : "new-tasks"); // Apply proper class

  // ===== Create checkbox =====
  const label = document.createElement("label");
  label.classList.add("checkbox-container");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed; // Mark as checked if completed

  const customCheckbox = document.createElement("span");
  customCheckbox.classList.add("custom-checkbox");

  // Assemble checkbox
  label.appendChild(checkbox);
  label.appendChild(customCheckbox);

  // ===== Task text =====
  const taskP = document.createElement("p");
  taskP.textContent = taskText;
  if (completed) taskP.style.textDecoration = "line-through"; // Strikethrough if completed

  // ===== Action icons =====
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash");
  deleteIcon.id = completed ? "comp-del" : "delete"; // Different ID for completed vs new
  deleteIcon.style.cursor = "pointer";

  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-solid", "fa-pen-to-square");
  editIcon.id = "edit";
  editIcon.style.cursor = "pointer";

  // ===== Assemble task element =====
  taskDiv.appendChild(label);
  taskDiv.appendChild(taskP);
  taskDiv.appendChild(deleteIcon);
  if (!completed) taskDiv.appendChild(editIcon); // Edit only allowed for new tasks

  // ===== Event: Checkbox toggle (move between new/completed sections) =====
  checkbox.addEventListener("change", () => {
    taskDiv.remove(); // Remove from current list
    if (checkbox.checked) {
      taskP.style.textDecoration = "line-through";
      completedTaskHead.appendChild(createTaskElement(taskP.textContent, true)); 
    } else {
      taskP.style.textDecoration = "none";
      newTaskHead.appendChild(createTaskElement(taskP.textContent, false)); 
    }
    
  });

  // ===== Event: Delete task =====
  deleteIcon.addEventListener("click", () => {
    taskDiv.remove(); // Remove task permanently
  });

  // ===== Event: Edit task =====
  editIcon.addEventListener("click", () => {
    const newText = prompt("Edit your task:", taskP.textContent);
    if (newText && newText.trim() !== "") {
      taskP.textContent = newText.trim(); // Update text if input is valid
    }
  });

  return taskDiv;
}

// Add task when clicking the "Add" button
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text !== "") {
    newTaskHead.appendChild(createTaskElement(text, false)); // Add as new task
    taskInput.value = ""; // Clear input
  }
});

// Add task when pressing Enter key in the input field
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTaskBtn.click();
});
