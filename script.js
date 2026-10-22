// Administra las tareas únicamente en memoria.
class TaskManager {
  constructor() {
    // Cinco ejemplos iniciales solicitados por la rúbrica del Sprint 1.
    this.tasks = [
      {
        id: 1,
        nombre: "Organizar el espacio de estudio",
        descripcion: "Dejar el escritorio listo para trabajar con concentración.",
        asignadoA: "Luisa Sepulveda",
        fechaDeEntrega: "2026-10-24",
        estado: "POR HACER"
      },
      {
        id: 2,
        nombre: "Preparar presentación del proyecto",
        descripcion: "Reunir las ideas principales y crear las diapositivas.",
        asignadoA: "Camila Torres",
        fechaDeEntrega: "2026-10-25",
        estado: "EN PROCESO"
      },
      {
        id: 3,
        nombre: "Revisar los requisitos del sprint",
        descripcion: "Leer la guía y comprobar cada punto de la rúbrica.",
        asignadoA: "Andrés Gómez",
        fechaDeEntrega: "2026-10-26",
        estado: "REVISIÓN"
      },
      {
        id: 4,
        nombre: "Actualizar el formulario de tareas",
        descripcion: "Verificar etiquetas, campos y opciones de estado.",
        asignadoA: "Valentina Rojas",
        fechaDeEntrega: "2026-10-27",
        estado: "HECHO"
      },
      {
        id: 5,
        nombre: "Compartir avances con el equipo",
        descripcion: "Enviar un resumen claro de los cambios realizados.",
        asignadoA: "Daniel Herrera",
        fechaDeEntrega: "2026-10-28",
        estado: "POR HACER"
      }
    ];

    this.nextId = 6;
  }

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithStatus(status) {
    return this.tasks.filter(task => task.estado === status);
  }

  addTask(task) {
    const newTask = {
      id: this.nextId++,
      nombre: task.nombre,
      descripcion: task.descripcion,
      asignadoA: task.asignadoA,
      fechaDeEntrega: task.fechaDeEntrega,
      estado: task.estado
    };

    this.tasks.push(newTask);
    return newTask;
  }

  deleteTask(taskId) {
    const initialLength = this.tasks.length;

    this.tasks = this.tasks.filter(
      task => task.id !== Number(taskId)
    );

    return this.tasks.length < initialLength;
  }

  updateTask(taskId, status) {
    const task = this.tasks.find(
      item => item.id === Number(taskId)
    );

    if (!task) return false;

    task.estado = status;
    return true;
  }

  assignTask(taskId, assignee) {
    const task = this.tasks.find(
      item => item.id === Number(taskId)
    );

    if (!task) return false;

    task.asignadoA = assignee;
    return true;
  }
}

const taskManager = new TaskManager();

const formulario = document.querySelector("#formularioTarea");
const listaTareas = document.querySelector("#listaTareas");
const errores = document.querySelector("#errores");
const cantidadTareas = document.querySelector("#cantidadTareas");

function validateTaskForm() {
  const nombre = document.querySelector("#nombre").value.trim();
  const descripcion =
    document.querySelector("#descripcion").value.trim();
  const asignadoA =
    document.querySelector("#asignadoA").value.trim();
  const fechaDeEntrega =
    document.querySelector("#fechaDeEntrega").value;
  const estado = document.querySelector("#estado").value;

  const mensajes = [];

  if (nombre.length <= 8) {
    mensajes.push("El nombre debe tener más de 8 caracteres.");
  }

  if (descripcion.length <= 15) {
    mensajes.push("La descripción debe tener más de 15 caracteres.");
  }

  if (asignadoA.length <= 8) {
    mensajes.push("El campo “Asignado a” debe tener más de 8 caracteres.");
  }

  if (!fechaDeEntrega) {
    mensajes.push("Selecciona una fecha de entrega.");
  }

  if (!estado) {
    mensajes.push("Selecciona un estado para la tarea.");
  }

  errores.replaceChildren();

  if (mensajes.length > 0) {
    const lista = document.createElement("ul");

    mensajes.forEach(mensaje => {
      const elemento = document.createElement("li");
      elemento.textContent = mensaje;
      lista.append(elemento);
    });

    errores.append(lista);
    errores.hidden = false;
    return false;
  }

  errores.hidden = true;
  return true;
}

function createTaskCard(task) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "card tarjeta-tarea";
  tarjeta.dataset.taskId = task.id;

  const parteSuperior = document.createElement("div");
  parteSuperior.className = "parte-superior";

  const nombre = document.createElement("h3");
  nombre.textContent = task.nombre;

  const botonEliminar = document.createElement("button");
  botonEliminar.className = "boton-eliminar";
  botonEliminar.type = "button";
  botonEliminar.textContent = "Eliminar";
  botonEliminar.setAttribute(
    "aria-label",
    `Eliminar tarea: ${task.nombre}`
  );

  botonEliminar.addEventListener("click", () => {
    taskManager.deleteTask(task.id);
    renderTasks();
  });

  parteSuperior.append(nombre, botonEliminar);

  const descripcion = document.createElement("p");
  descripcion.textContent = task.descripcion;

  const detalles = document.createElement("div");
  detalles.className = "detalles";

  const asignado = document.createElement("span");
  asignado.textContent = `Asignado a: ${task.asignadoA}`;

  const fecha = document.createElement("span");
  fecha.textContent = `Entrega: ${task.fechaDeEntrega}`;

  detalles.append(asignado, fecha);

  const estado = document.createElement("span");
  estado.className = "estado";
  estado.textContent = task.estado;

  tarjeta.append(parteSuperior, descripcion, detalles, estado);
  return tarjeta;
}

function renderTasks() {
  const tasks = taskManager.getAllTasks();
  listaTareas.replaceChildren();

  if (tasks.length === 0) {
    const mensaje = document.createElement("div");
    mensaje.className = "sin-tareas";
    mensaje.textContent =
      "Aún no hay tareas. Agrega la primera en el formulario.";
    listaTareas.append(mensaje);
  } else {
    tasks.forEach(task => {
      listaTareas.append(createTaskCard(task));
    });
  }

  cantidadTareas.textContent =
    `${tasks.length} ${tasks.length === 1 ? "tarea" : "tareas"}`;
}

formulario.addEventListener("submit", event => {
  event.preventDefault();

  if (!validateTaskForm()) return;

  const formData = new FormData(formulario);

  taskManager.addTask({
    nombre: formData.get("nombre").trim(),
    descripcion: formData.get("descripcion").trim(),
    asignadoA: formData.get("asignadoA").trim(),
    fechaDeEntrega: formData.get("fechaDeEntrega"),
    estado: formData.get("estado")
  });

  formulario.reset();
  renderTasks();
});

renderTasks();