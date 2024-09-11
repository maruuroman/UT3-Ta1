class taskMenu {
    constructor(HTML_Element) {
      this.element = HTML_Element;
      this.title = HTML_Element.querySelector(".modal-card-title");
      this.btn_holder = HTML_Element.querySelector(".buttons");
  
      const modal_background = document.getElementById("background");
      modal_background.addEventListener("click", () => this.close());
      this.btn_holder.children[0].addEventListener("click", () => this.close());
      this.element.addEventListener("keydown", ({ key }) => {
        if (key === "Escape") this.close();
      });
    }
  
    /*
    spawn(task, dashboard) {
      let title;
      const confirm_button = this.btn_holder.children[1];
  
      if (task.is_empty) {
        this.clearInput();
        title = "Nueva tarea";
        confirm_button.innerText = "Agregar tarea";
      } else {
        if (!(task instanceof taskCard)) {
          console.error('task no es una instancia de taskCard');
          return;
        }
        this.fillInput(task);
        title = "Editar tarea";
        confirm_button.innerText = "Aceptar";
      }
  
      confirm_button.addEventListener("click", () => {
        const args = this.recoverInput();
  
        if (args !== null) {
          if (task.is_empty) {
            const newTask = {
              title: args[0],
              description: args[1],
              assignedTo: args[2],
              priority: args[3],
              status: args[4],
              endDate: args[5],
            };
  
            // Validar estado
            const validStatuses = ["Backlog", "To-Do", "In Progress", "Blocked", "Done"];
            if (!validStatuses.includes(newTask.status)) {
              alert('Estado inválido.');
              return;
            }
  
            createTask(newTask); // Llama a la función para crear la tarea en el backend
          } else {
            task.fill(args[0], args[1], args[2], args[3], args[4], args[5]);
            dashboard.deleteTask(task); // Por si estamos modificando la tarea, y se cambió de columna
            dashboard.addTask(task, args[4].toLowerCase().replaceAll(" ", "-"));
          }
  
          this.close();
        }
      });
  
      this.title.innerText = title;
      this.element.classList.add("is-active");
    }*/

      spawn(task, dashboard) {
        let title;
        const confirm_button = this.btn_holder.children[1];
    
        if (task.is_empty) {
            this.clearInput();
            title = "Nueva tarea";
            confirm_button.innerText = "Agregar tarea";
        } else {
            if (!(task instanceof taskCard)) {
                console.error('task no es una instancia de taskCard');
                return;
            }
            this.fillInput(task);
            title = "Editar tarea";
            confirm_button.innerText = "Aceptar";
        }
    
        confirm_button.addEventListener("click", () => {
            const args = this.recoverInput();
    
            if (args !== null) {
                if (task.is_empty) {
                    const newTask = {
                        title: args[0],
                        description: args[1],
                        assignedTo: args[2],
                        priority: args[3],
                        status: args[4],
                        endDate: args[5],
                    };
    
                    // Validar estado
                    const validStatuses = ["Backlog", "To-Do", "In Progress", "Blocked", "Done"];
                    if (!validStatuses.includes(newTask.status)) {
                        alert('Estado inválido.');
                        return;
                    }
    
                    createTask(newTask); // Llama a la función para crear la tarea en el backend
                } else {
                    task.fill(args[0], args[1], args[2], args[3], args[4], args[5]);
                    dashboard.deleteTask(task); // Por si estamos modificando la tarea, y se cambió de columna
                    dashboard.addTask(task, args[4].toLowerCase().replaceAll(" ", "-"));
                }
    
                this.close();
            }
        });
    
        this.title.innerText = title;
        this.element.classList.add("is-active");
    }
    
  
    recoverInput() {
      const titulo = this.element.querySelector("#titulo").value;
      const descripcion = this.element.querySelector("#descripcion").value;
      const asignado = this.element.querySelector("#asignado").value;
      const prioridad = this.element.querySelector("#prioridad").value;
      const estado = this.element.querySelector("#estado").value;
      const fecha_limite = this.element.querySelector("#fecha_limite").value;
  
      if (!titulo || !descripcion || !asignado || !prioridad || !estado || !fecha_limite) {
        alert("Ingrese todos los datos.");
        return null;
      }
  
      return [titulo, descripcion, asignado, prioridad, estado, fecha_limite];
    }
  
    clearInput() {
      this.element.querySelector("#titulo").value = "";
      this.element.querySelector("#descripcion").value = "";
      this.element.querySelector("#asignado").value = "";
      this.element.querySelector("#prioridad").value = "";
      this.element.querySelector("#estado").value = "";
      this.element.querySelector("#fecha_limite").value = "";
    }
  
    fillInput(task) {
      const fechaLimite = task.fecha_limite instanceof Date && !isNaN(task.fecha_limite.getTime())
        ? task.fecha_limite.toISOString().split('T')[0]
        : '';
  
      this.element.querySelector("#titulo").value = task.titulo;
      this.element.querySelector("#descripcion").value = task.desc;
      this.element.querySelector("#asignado").value = task.asignado;
      this.element.querySelector("#prioridad").value = task.prioridad;
      this.element.querySelector("#estado").value = task.estado;
      this.element.querySelector("#fecha_limite").value = fechaLimite;
    }
  
    close() {
      this.btn_holder.replaceChild(this.btn_holder.children[1].cloneNode(), this.btn_holder.children[1]);
      this.element.classList.remove("is-active");
    }
  }
  