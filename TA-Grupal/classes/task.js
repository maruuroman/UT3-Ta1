class taskCard {
  constructor() {
    this.is_empty = true;
    this.titulo = null;
    this.desc = null;
    this.asignado = null;
    this.prioridad = null;
    this.estado = null;
    this.fecha_limite = null;

    this.element = document.createElement("div");
    this.element.classList.add("card");
    this.element.setAttribute("draggable", "true");
    this.element.setAttribute("id", crypto.randomUUID());

    this.element.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", event.target.id);
      this.element.classList.add("dragging");
    });

    this.element.addEventListener("dragend", () => {
      this.element.classList.remove("dragging");
      this.estado = this.element.parentNode.getAttribute("id");
    });
  }

  fill(titulo, desc, asignado, prioridad, estado, fecha_limite) {
    this.titulo = titulo;
    this.desc = desc;
    this.asignado = asignado;
    this.prioridad = prioridad;
    this.estado = estado;
    this.fecha_limite = fecha_limite;

    this.element.innerHTML = `
      <header class="card-header">
          <p class="card-header-title">${titulo}</p>
          <div class="card-header-icon">
              <button class="delete"></button>
          </div>
      </header>
      <div class="card-content">
          <div class="content">${desc}</div>
          <div class="tags">
              <span class="tag is-info is-light is-medium">
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

    this.is_empty = false;
    this.element.querySelector(".delete").addEventListener("click", () => {
      this.delete();
    });
  }

  delete() {
    this.element.parentNode.removeChild(this.element);
  }
}
