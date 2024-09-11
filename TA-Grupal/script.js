
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

function parseDate(dateString) {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(`${year}-${month}-${day}`);
}


const getTasks = async () => {
  try {
      const response = await fetch(`http://localhost:3000/api/tasks`);
      if (response.ok) {
          const tasks = await response.json()
          console.log('Tareas obtenidas del backend:', tasks)
          tasks.forEach(task => {
              // Crear una nueva tarjeta usando los datos del backend
              if (task.status) { // Verificar si status está definido
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
  // Limpiar el formulario antes de abrirlo
  document.getElementById("titulo").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("asignado").value = "";
  document.getElementById("prioridad").value = "";
  document.getElementById("estado").value = "Backlog"; // Estado por defecto
  document.getElementById("fecha_limite").value = "";

  menu.spawn({}, dashboard);

  try {
    const response = await fetch(`http://localhost:3000/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      const savedTask = await response.json();
      const task = new taskCard();
      task.fill(
        savedTask.title,
        savedTask.description,
        savedTask.assignedTo,
        savedTask.priority,
        savedTask.status,
        new Date(savedTask.endDate)
      );
      /*const column = document.getElementById(estado); // Asumiendo que `estado` es el id de la columna
      column.appendChild(newTask.element);*/
      dashboard.addTask(task, savedTask.status.toLowerCase().replaceAll(" ", "-"));
    }
  } catch (error) {
    console.error('Error al agregar tarea:', error);
  }

  
  // Función para una nueva tarea al backend y agregarla a la columna
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
        console.log('Task created:', createdTask);
        /*  addTaskToColumn(createdTask);
        } else {
          const error = await response.json();
          alert(error.error);
        }
      } catch (error) {
        console.error("Error creating task:", error);
      }
      }*/
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
      alert(error.error);
      }
      } catch (error) {
      console.error("Error al crear tarea:", error);
      }
      }
      createTask(newTask);

  // Cerrar el modal (asumiendo que tienes lógica para cerrar el modal)
  document.getElementById('task-menu').classList.remove('is-active');


});


async function editTask(task) {
  try {
    const response = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
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
    }else {
      const error = await response.json();
      console.error('Error editing task:', error);
    }
  } catch (error) {
    console.error('Error al editar la tarea:', error);
  }
}



function deleteTask(task) {
    fetch(`http://localhost:3000/api/tasks/${task.id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        // Si la eliminación fue exitosa en el backend, elimina la tarea del dashboard
        dashboard.deleteTask(task);
      }
    })
    .catch(error => console.error(error));
  }

// script.js

// Función para agregar una tarea a la columna correspondiente
function addTaskToColumn(task) {
  const columnId = task.status.toLowerCase().replace(' ', '-'); // Convertir estado a id de columna
  const column = document.getElementById(columnId);
  if (!column) return; // Si no encuentra la columna, no hace nada
  
  const ul = column.querySelector('ul') || createColumnList(column); // Crear <ul> si no existe

  const li = document.createElement('li');
  li.textContent = task.title;
  ul.appendChild(li);
}

// Crear <ul> en la columna si no existe
function createColumnList(column) {
  const ul = document.createElement('ul');
  column.appendChild(ul);
  return ul;
}


// Configurar evento para el botón de guardar
document.getElementById('save-button').addEventListener('click', async () => {

  // Obtener datos del formulario
  const newTask = {
    title: document.getElementById('titulo').value,
    description: document.getElementById('descripcion').value,
    assignedTo: document.getElementById('asignado').value,
    priority: document.getElementById('prioridad').value,
    status: document.getElementById('estado').value,
    endDate: document.getElementById('fecha_limite').value,
  };

   // Validar el estado
   //const validStatuses = ['Backlog', 'To-Do', 'In Progress', 'Blocked', 'Done'];
   //if (!validStatuses.includes(newTask.status)) {
   //  alert('Estado inválido');
   //  return;
   //}

   // Validar los campos antes de enviar
   if (!newTask.title || !newTask.status) {
    alert('Por favor completa los campos obligatorios.');
    return;
  }
    /*
   // Enviar la tarea al servidor
   fetch('http://localhost:3000/api/tasks', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(newTask),
   })
   .then(response => response.json())
   .then(data => {
     console.log('Tarea agregada:', data);
     // Aquí podrías agregar la nueva tarea a la interfaz
   })
   .catch(error => {
     console.error('Error al agregar la tarea:', error);
   });*/

   // Enviar la tarea al servidor
  try {
    const response = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      const createdTask = await response.json();
      console.log('Tarea agregada:', createdTask);
      
      // Crear la tarea y agregarla al dashboard
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

      // Cerrar el modal
      document.getElementById('task-menu').classList.remove('is-active');
    } else {
      const error = await response.json();
      console.error('Error al agregar tarea:', error);
      alert(error.error);
    }
  } catch (error) {
    console.error("Error al crear tarea:", error);
  }
 });
