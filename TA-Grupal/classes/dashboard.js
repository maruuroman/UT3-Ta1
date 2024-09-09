class dashboardColumn {
    constructor(name, id) {
        // html
        this.element = document.createElement("div");
        this.element.classList.add(
            "custom-column"
            //"column",
            //"has-background-light",
            //"is-flex",
            //"is-flex-direction-column",
            //"is-align-items-center"
        );
        this.element.setAttribute("id", id);
        this.element.innerHTML = '<h2 class="subtitle is-3">${name}</h2>';

        // parte donde van las tarjetas
        const inner_area = document.createElement("div");
        inner_area.classList.add("inner-column");
        this.element.appendChild(inner_area);

        // Configuramos eventos
        this.element.addEventListener('dragover', (event) => {
            event.preventDefault(); // Necesario para permitir el drop
        });

        this.element.addEventListener('drop', (event) => {
            event.preventDefault();
            const dragged_element_id = event.dataTransfer.getData('text/plain'); // Obtener el ID del elemento arrastrado
            const dragged_element = document.getElementById(dragged_element_id); // Buscar el elemento arrastrado por su ID

            if (dragged_element) {
                inner_area.appendChild(dragged_element); // Mover el elemento arrastrado a la nueva columna
            } else {
                console.error('El elemento arrastrado no existe en el DOM:', dragged_element_id);
            }
        });
        //// Configuramos eventos
        //this.element.addEventListener('dragover', (event) => {
        //    event.preventDefault(); // Necesario para permitir el drop
        //});
        //
        //this.element.addEventListener('drop', (event) => {
        //    event.preventDefault();
        //    const dragged_element_id = event.dataTransfer.getData('text/plain'); // Obtener el ID del elemento arrastrado
        //    const dragged_element = document.getElementById(dragged_element_id); // Buscar el elemento arrastrado por su ID
        //
        //    if (dragged_element) {
        //        this.element.appendChild(dragged_element); // Mover el elemento arrastrado a la nueva columna
        //    } else {
        //        console.error('El elemento arrastrado no existe en el DOM:', dragged_element_id);
        //    }
        //});
    }
}

class taskDashboard {
    constructor(HTML_Element) {
        // tarjetas
        this.contents = [];

        // html
        this.element = HTML_Element;
        this.element.classList.add(
            "dashboard"
            //"columns",
            //"is-multiline",
            //"is-gap-3"
        );
    }

    
    // crea las columnas donde se clasifican las tareas.
    setColumns(column_names) {
        column_names.forEach(name => {
            const name_low = name.toLowerCase().replaceAll(" ", "-");
            this[name_low] = new dashboardColumn(name, name_low);
            this.element.appendChild(this[name_low].element);
        });
    }

    addTask(task, state) {
        
        this.contents.push(task)
        this[state].element.querySelector(".inner-column").appendChild(task.element);
        
        //// Evento para abrir el modal de edición.
        //this.element.querySelector(".card-content").addEventListener("click", () => modal.spawn(task));

        // Evento para eliminar la tarea.
        //task.element.querySelector(".card-header-icon").addEventListener("click", () => this.deleteTask(task));
    
    }

    deleteTask(task) {
        if (this.contents.includes(task)) {
            task.delete();
            this.contents = this.contents.filter(keep => keep !== task);
            /*
            // debug
            if (this.contents.includes(task))
                console.log("No se borró!");
            */
            // Guarda las tareas cada vez que se elimina una
            this.saveTasks();
        }
    }

    setCalls(task, modal) {
        task.element.querySelector(".card-header-icon").addEventListener("click", () => this.deleteTask(task));
        task.element.querySelector(".card-content").addEventListener("click", () => modal.spawn(task, this));
    }
}