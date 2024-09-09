/***
 * SUJETO A CAMBIOS
 * Clase que "envuelve" una tarjeta (un div con cosas adentro).
 * El único objetivo es estructurar la lógica.
 */
class taskCard {
  constructor() {
    // Indica si la tarjeta está recién creada
    this.is_empty = true;

    // Info de la tarea 
    this.titulo = null;
    this.desc = null;
    this.asignado = null;
    this.prioridad = null;
    this.estado = null;
    this.fecha_limite = null;

    // Elemento HTML, con sus atributos correspondientes
    this.element = document.createElement("div");
    this.element.classList.add("card");
    this.element.setAttribute("draggable", "true");
    this.element.setAttribute("id", crypto.randomUUID());

    // Añadir eventos de arrastrar y soltar a la tarea, es necesario que sea cuando son creados porque sino no lo toma
    this.element.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", event.target.id);
      this.element.classList.add("dragging");
    });

    this.element.addEventListener("dragend", () => {
      this.element.classList.remove("dragging");
      // actualizamos estado
      this.estado = this.element.parentNode.getAttribute("id");
    });
  }

  // TODO hacer bien la template, que se ve como el tuje
  /***
   * Método para rellenar la tarjeta. Se usa el mismo al crearla por primera vez o editarla
   */
  fill(titulo, desc, asignado, prioridad, estado, fecha_limite) {
    // Llenamos los atributos
    this.titulo = titulo;
    this.desc = desc;
    this.asignado = asignado;
    this.prioridad = prioridad;
    this.estado = estado;
    this.fecha_limite = fecha_limite;

    // Llenamos el html
    this.element.innerHTML = `
    <header class="card-header">
        <p class="card-header-title">${titulo}</p>
        <div class="card-header-icon">
            <!--<span class="material-symbols-outlined">close</span>-->
            <button class="delete"></button>
        </div>
    </header>
    <div class="card-content">
        <div class="content">${desc}</div>
        <div class="tags">
            <span class="tag is info is-light is-medium">
                <span class="material-symbols-outlined">schedule</span>
                ${fecha_limite.toString()}
            </span>
            <span class="tag is-info is-light is-medium">
                <span class="material-symbols-outlined">account_circle</span>
                ${asignado}
            </span>
            <span class="tag is-light is-medium" id="prioridad">${prioridad}</span>
        </div>
    </div>
`;

    // Coloreamos el tag con la prioridad
    switch (prioridad) {
      case "Alta":
        this.element.querySelector("#prioridad").classList.add("is-danger");
        break;
      case "Media":
        this.element.querySelector("#prioridad").classList.add("is-warning");
        break;
      case "Baja":
        this.element.querySelector("#prioridad").classList.add("is-success");
        break;
    }
    // Marcamos la tarjeta como rellena
    this.is_empty = false;

    this.element.querySelector(".delete").addEventListener("click", () => {
      this.delete();
    });

  }

  delete() {
    this.element.parentNode.removeChild(this.element);
  }
}

const columns = document.querySelectorAll(".custom-column");

columns.forEach((column) => {
  column.addEventListener("dragover", (event) => {
    event.preventDefault();
    column.classList.add("drag-over"); // Añade la clase 'drag-over' al arrastrar
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("drag-over"); // Elimina la clase 'drag-over' al salir
  });

  column.addEventListener("drop", (event) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(id);
    column.classList.remove("drag-over"); // Elimina la clase 'drag-over' al soltar
    column.appendChild(draggedElement);
  });
});