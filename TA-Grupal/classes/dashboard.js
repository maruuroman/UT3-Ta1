class dashboardColumn {
    constructor(name, id) {
        // html
        this.element = document.createElement("div");
        this.element.classList.add("custom-column");
        this.element.setAttribute("id", id);
        this.element.innerHTML = `<h2 class="subtitle is-3">${name}</h2>`;

        // parte donde van las tarjetas
        this.inner_area = document.createElement("div");
        this.inner_area.classList.add("inner-column");
        this.element.appendChild(this.inner_area);

        // Configuramos eventos
        this.element.addEventListener('dragover', (event) => {
            event.preventDefault(); // Necesario para permitir el drop
        });

        this.element.addEventListener('drop', (event) => {
            event.preventDefault();
            const dragged_element_id = event.dataTransfer.getData('text/plain'); // Obtener el ID del elemento arrastrado
            const dragged_element = document.getElementById(dragged_element_id); // Buscar el elemento arrastrado por su ID

            if (dragged_element) {
                this.inner_area.appendChild(dragged_element); // Mover el elemento arrastrado a la nueva columna
            } else {
                console.error('El elemento arrastrado no existe en el DOM:', dragged_element_id);
            }
        });
    }
}


class taskDashboard {
    /*
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
    }*/


    constructor(element) {
        this.element = element;
        this.columns = {};
        }

    /*
    // crea las columnas donde se clasifican las tareas.
    setColumns(column_names) {
        column_names.forEach(name => {
            const name_low = name.toLowerCase().replaceAll(" ", "-");
            this[name_low] = new dashboardColumn(name, name_low);
            this.element.appendChild(this[name_low].element);
        });
    }*/
    
    setColumns(columnNames) {
        columnNames.forEach(name => {
            const columnId = name.toLowerCase().replaceAll(" ", "-");
            this.columns[columnId] = new dashboardColumn(name, columnId);
            this.element.appendChild(this.columns[columnId].element);
        });
    }
    /*
    addTask(task, state) {
        this.contents.push(task)
        this[state].element.querySelector(".inner-column").appendChild(task.element);
        
    }*/

    /*
    addTask(task, columnId) {
        const column = this.columns[columnId];
        if (column) {
            column.inner_area.appendChild(task.element); // Append task to the inner column area
        } else {
            console.error(`Columna ${columnId} no encontrada`);
        }
    }
    */
    addTask(task, columnId) {
        if (!(task instanceof taskCard)) {
            console.error('task no es una instancia de taskCard');
            return;
        }
        const column = this.columns[columnId];
        if (column) {
            column.inner_area.appendChild(task.element); // Append task to the inner column area
        } else {
            console.error(`Columna ${columnId} no encontrada`);
        }
    }
    
    
    deleteTask(task) {
        if (this.contents.includes(task)) {
            task.delete();
            this.contents = this.contents.filter(keep => keep !== task);
            this.saveTasks();
        }
    }

    setCalls(task, modal) {
        if (!(task instanceof taskCard)) {
            console.error('task no es una instancia de taskCard');
            return;
        }
        task.element.querySelector(".card-header-icon").addEventListener("click", () => this.deleteTask(task));
        task.element.querySelector(".card-content").addEventListener("click", () => modal.spawn(task, this));
    }
    
}