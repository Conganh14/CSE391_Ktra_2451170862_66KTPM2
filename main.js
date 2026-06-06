const taskListEl = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const taskNameInput = document.getElementById("taskName");
const taskHelp = document.getElementById("taskHelp");
const modalEl = document.getElementById("addTaskModal");

function renderTasks(tasks) {
  if (!tasks || tasks.length === 0) {
    taskListEl.innerHTML =
      '<div class="text-center text-secondary py-5">Không có công việc nào.</div>';
    return;
  }

  taskListEl.innerHTML = tasks
    .map((task) => {
      const statusClass =
        task.status === "Done"
          ? "status-done"
          : task.status === "In Progress"
            ? "status-progress"
            : "";
      return `
        <div class="list-group-item rounded-4 mb-3 shadow-sm border-0 bg-white task-row">
          <div class="row align-items-center gx-3">
            <div class="col-md-5">
              <div class="text-uppercase text-secondary small mb-1">Task</div>
              <div class="fw-semibold">${task.task}</div>
            </div>
            <div class="col-md-3">
              <div class="text-uppercase text-secondary small mb-1">Priority</div>
              <span class="text-${task.priority === "High" ? "danger" : task.priority === "Low" ? "success" : "warning"} fw-bold">${task.priority}</span>
            </div>
            <div class="col-md-2 text-center">
              <span class="badge rounded-pill bg-secondary bg-opacity-10 text-secondary">${task.status}</span>
            </div>
            <div class="col-md-1 text-center">
              <span class="status-dot ${statusClass}"></span>
            </div>
            <div class="col-md-1 text-end">
              <button class="btn btn-outline-secondary btn-sm me-1" type="button">✎</button>
              <button class="btn btn-outline-danger btn-sm" type="button">🗑</button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function resetValidation() {
  taskNameInput.classList.remove("is-gitinvalid");
  taskHelp.textContent = "";
}

function validateTaskName(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Tên Task không được để trống.";
  }
  if (trimmed.length > 100) {
    return "Tên Task không quá 100 ký tự.";
  }
  return "";
}

function closeModal() {
  const bsModal = bootstrap.Modal.getInstance(modalEl);
  if (bsModal) {
    bsModal.hide();
  }
}

function handleSubmit(event) {
  event.preventDefault();
  resetValidation();

  const taskName = taskNameInput.value;
  const error = validateTaskName(taskName);
  if (error) {
    taskNameInput.classList.add("is-invalid");
    taskHelp.textContent = error;
    return;
  }

  taskNameInput.value = "";
  closeModal();
}

async function loadTaskData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error("Không thể tải data.json");
    }
    const data = await response.json();
    renderTasks(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error(error);
    taskListEl.innerHTML =
      '<div class="text-center text-danger py-5">Không thể tải danh sách. Vui lòng chạy qua server hoặc kiểm tra đường dẫn.</div>';
  }
}

taskForm.addEventListener("submit", handleSubmit);
loadTaskData();
