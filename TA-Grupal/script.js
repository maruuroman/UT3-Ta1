const column_categories = ["Backlog", "To-Do", "In Progress", "Blocked", "Done"];

// Recuperamos elementos
const dashboard = new taskDashboard(document.getElementById("task-dashboard"));
const menu = new taskMenu(document.getElementById("task-menu"));
const theme_switch = document.getElementById("theme_switcher_btn");
const add_task_btn = document.getElementById("add_task_btn");

dashboard.setColumns(column_categories);

// Eventos
theme_switch.addEventListener("click", () => {
  // Cambiar tema en el HTML
  document.getElementsByTagName("html")[0].classList.toggle("theme-dark");

  // Cambiar el ícono del botón
  const iconSpan = theme_switch.querySelector("span");
  iconSpan.innerText = (iconSpan.innerText === "dark_mode") ? "light_mode" : "dark_mode";
});


const getTasks = async () => {
  try {
      const response = await fetch("http:localhost:3000/api/tasks");
      if (response.ok) {
          const tasks = await response.json()
          console.log('Tareas obtenidas del backend:', tasks)
          tasks.forEach(task => {
              // Crear una nueva tarjeta usando los datos del backend
              if (task.status) { // Verificar si status está definido
                const newTask = new taskCard();
                newTask.fill(
                  task.title,
                  task.description,
                  task.assignedTo,
                  task.priority,
                  task.status,
                  new Date(task.endDate)
                );

                // Añadir la tarea a la columna correspondiente
                dashboard.addTask(newTask, task.status.toLowerCase().replaceAll(" ", "-"));
            } else {
                console.warn('Status no definido para la tarea:', task);
            }
          });
    }
  }catch(error) {
      console.error(error)
  }
}

getTasks();

add_task_btn.addEventListener("click", async () => {
  const newTask = {
    title: "",
    description: "",
    assignedTo: "",
    priority: "",
    status: "Backlog",
    startDate: new Date().toISOString(),
    endDate: "",
  };

  menu.spawn(newTask, dashboard);

  try {
    const response = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      const savedTask = await response.json();
      const taskCard = new taskCard();
      taskCard.fill(
        savedTask.title,
        savedTask.description,
        savedTask.assignedTo,
        savedTask.priority,
        savedTask.status,
        new Date(savedTask.endDate)
      );
      dashboard.addTask(taskCard, savedTask.status.toLowerCase().replaceAll(" ", "-"));
    }
  } catch (error) {
    console.error('Error al agregar tarea:', error);
  }
});


async function editTask(task) {
  try {
    const response = await fetch("http://localhost:3000/api/tasks/${task.id}", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: task.titulo,
        description: task.desc,
        assignedTo: task.asignado,
        priority: task.prioridad,
        status: task.estado,
        endDate: task.fecha_limite,
      }),
    });

    if (response.ok) {
      const updatedTask = await response.json();
      task.fill(
        updatedTask.title,
        updatedTask.description,
        updatedTask.assignedTo,
        updatedTask.priority,
        updatedTask.status,
        new Date(updatedTask.endDate)
      );
    }
  } catch (error) {
    console.error('Error al editar la tarea:', error);
  }
}



function deleteTask(task) {
    fetch("http://localhost:3000/api/tasks/${task.id}", {
      method: "DELETE",
    })
    .then(response => {
      if (response.ok) {
        // Si la eliminación fue exitosa en el backend, elimina la tarea del dashboard
        dashboard.deleteTask(task);
      }
    })
    .catch(error => console.error(error));
  }
