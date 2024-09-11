const column_categories = ["Backlog", "To-Do", "In Progress", "Blocked", "Done"];

// Recuperamos elementos
const dashboard = new taskDashboard(document.getElementById("task-dashboard"));
const menu = new taskMenu(document.getElementById("task-menu"));
const theme_switch = document.getElementById("theme_switcher_btn");
const add_task_btn = document.getElementById("add_task_btn");

// Configurar columnas en el dashboard
dashboard.setColumns(column_categories);

// Eventos
theme_switch.addEventListener("click", () => {
  document.getElementsByTagName("html")[0].classList.toggle("theme-dark");
  const iconSpan = theme_switch.querySelector("span");
  iconSpan.innerText = (iconSpan.innerText === "dark_mode") ? "light_mode" : "dark_mode";
});

function parseDate(dateString) {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(`${year}-${month}-${day}`);
}

const getTasks = async () => {
  try {
      const response = await fetch(`http://localhost:3000/api/tasks`);
      if (response.ok) {
          const tasks = await response.json();
          console.log('Tareas obtenidas del backend:', tasks);
          tasks.forEach(task => {
              if (task.status) {
                const endDate = parseDate(task.endDate);
                if (isNaN(endDate.getTime())) {
                  console.error(`Fecha límite inválida para la tarea: ${task.endDate}`);
                  return;
                }

                const newTask = new taskCard();
                newTask.fill(
                  task.title,
                  task.description,
                  task.assignedTo,
                  task.priority,
                  task.status,
                  endDate
                );
                dashboard.addTask(newTask, task.status.toLowerCase().replaceAll(" ", "-"));
            } else {
                console.warn('Status no definido para la tarea:', task);
            }
          });
      }
  } catch(error) {
      console.error(error);
  }
}

getTasks();

add_task_btn.addEventListener("click", () => {
  // Limpiar el formulario antes de abrirlo
  document.getElementById("titulo").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("asignado").value = "";
  document.getElementById("prioridad").value = "";
  document.getElementById("estado").value = "Backlog";
  document.getElementById("fecha_limite").value = "";

  menu.spawn({}, dashboard);
});

// Función para agregar tarea al backend
async function createTask(newTask) {
  try {
      const response = await fetch('http://localhost:3000/api/tasks', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTask),
      });

      if (response.ok) {
          const createdTask = await response.json();
          console.log('Tarea creada:', createdTask);
          const task = new taskCard();
          task.fill(
              createdTask.title,
              createdTask.description,
              createdTask.assignedTo,
              createdTask.priority,
              createdTask.status,
              new Date(createdTask.endDate)
          );
          dashboard.addTask(task, createdTask.status.toLowerCase().replaceAll(" ", "-"));
      } else {
          const error = await response.json();
          console.error('Error al agregar tarea:', error);
      }
  } catch (error) {
      console.error("Error al crear tarea:", error);
  }
}


// Configurar evento para el botón de guardar
document.getElementById('save-button').addEventListener('click', () => {
  const newTask = {
    title: document.getElementById('titulo').value,
    description: document.getElementById('descripcion').value,
    assignedTo: document.getElementById('asignado').value,
    priority: document.getElementById('prioridad').value,
    status: document.getElementById('estado').value,
    endDate: document.getElementById('fecha_limite').value,
  };

  if (!newTask.title || !newTask.status) {
    alert('Por favor completa los campos obligatorios.');
    return;
  }

  createTask(newTask);

  // Cerrar el modal
  document.getElementById('task-menu').classList.remove('is-active');
});
