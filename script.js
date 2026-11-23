// ==========================================================================
// CLASE TASKMANAGER
// Administra la lista de tareas en memoria y su persistencia en localStorage.
// ==========================================================================
class TaskManager {
  constructor() {
    // Lista de tareas iniciales solicitadas para pruebas
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

    // Contador incremental para asignar identificadores únicos a nuevas tareas
    this.currentId = 6;
  }

  // Devuelve todas las tareas registradas
  getAllTasks() {
    return this.tasks;
  }

  // Filtra y devuelve tareas según su estado (ej: "POR HACER", "HECHO")
  getTasksWithStatus(status) {
    return this.tasks.filter(task => task.estado === status);
  }

  // Agrega una nueva tarea a la lista con un id único generado
  addTask(task) {
    const newTask = {
      id: this.currentId++,
      nombre: task.nombre,
      descripcion: task.descripcion,
      asignadoA: task.asignadoA,
      fechaDeEntrega: task.fechaDeEntrega,
      estado: task.estado
    };

    this.tasks.push(newTask);
    return newTask;
  }

  // Elimina una tarea comparando por su identificador
  deleteTask(taskId) {
    const longitudInicial = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== Number(taskId));
    return this.tasks.length < longitudInicial;
  }

  // Actualiza el estado de una tarea existente
  updateTask(taskId, status) {
    const task = this.getTaskById(Number(taskId));
    if (!task) return false;

    task.estado = status;
    return true;
  }

  // Asigna una tarea a una persona diferente
  assignTask(taskId, assignee) {
    const task = this.getTaskById(Number(taskId));
    if (!task) return false;

    task.asignadoA = assignee;
    return true;
  }

  // ------------------------------------------------------------------------
  // PASO 4 (Tarea 7): Método para buscar una tarea por su id
  // Recibe el id numérico y recorre this.tasks para encontrarla y retornarla.
  // ------------------------------------------------------------------------
  getTaskById(taskId) {
    // Variable para almacenar la tarea que coincida con el id
    let tareaEncontrada;

    // Recorremos el arreglo de tareas
    for (let i = 0; i < this.tasks.length; i++) {
      const tareaActual = this.tasks[i];

      // Comparamos el id de la tarea actual con el id recibido
      if (tareaActual.id === taskId) {
        tareaEncontrada = tareaActual;
      }
    }

    // Retornamos la tarea encontrada (o undefined si no existe)
    return tareaEncontrada;
  }

  // ------------------------------------------------------------------------
  // TAREA 8 - PASO 1: Guardar las tareas en localStorage
  // Convierte el arreglo de tareas y el contador de IDs en texto JSON y los guarda.
  // ------------------------------------------------------------------------
  save() {
    // 1. Convertimos el arreglo this.tasks a string JSON
    const tasksJson = JSON.stringify(this.tasks);

    // 2. Guardamos las tareas con la clave 'tasks'
    localStorage.setItem("tasks", tasksJson);

    // 3. Convertimos el contador de ID a string y lo guardamos con la clave 'currentId'
    const currentIdString = String(this.currentId);
    localStorage.setItem("currentId", currentIdString);
  }

  // ------------------------------------------------------------------------
  // TAREA 8 - PASO 3: Cargar las tareas desde localStorage
  // Si hay datos guardados previamente en el navegador, los recupera y asigna.
  // ------------------------------------------------------------------------
  load() {
    // 1. Verificamos si hay tareas guardadas en localStorage
    const tasksJson = localStorage.getItem("tasks");

    // Si existen datos guardados, los convertimos con JSON.parse()
    if (tasksJson) {
      this.tasks = JSON.parse(tasksJson);
    } else {
      // Si es la primera vez y no hay nada guardado, guardamos las tareas iniciales
      this.save();
    }

    // 2. Verificamos si está guardado el contador de IDs
    const currentIdString = localStorage.getItem("currentId");

    // Si existe, lo convertimos a número para continuar la secuencia correctamente
    if (currentIdString) {
      this.currentId = Number(currentIdString);
    }
  }

  // ------------------------------------------------------------------------
  // RENDERIZADO:
  // Método que limpia el contenedor y dibuja todas las tarjetas en pantalla.
  // ------------------------------------------------------------------------
  render() {
    const contenedorLista = document.querySelector("#listaTareas");
    const contadorElemento = document.querySelector("#cantidadTareas");

    // 1. Limpiamos el contenedor para evitar duplicar tarjetas
    contenedorLista.innerHTML = "";

    // Si no hay tareas, mostramos un mensaje visual
    if (this.tasks.length === 0) {
      contenedorLista.innerHTML = `
        <div class="sin-tareas">
          Aún no hay tareas. Agrega la primera en el formulario.
        </div>
      `;
      if (contadorElemento) {
        contadorElemento.textContent = "0 tareas";
      }
      return;
    }

    // 2 y 3. Recorremos this.tasks y generamos el HTML de cada tarjeta
    const tarjetasHtml = [];
    for (let i = 0; i < this.tasks.length; i++) {
      const tarea = this.tasks[i];
      // Llamamos a la función constructora pasando las propiedades y el id
      const htmlTarjeta = createTaskHtml(
        tarea.id,
        tarea.nombre,
        tarea.descripcion,
        tarea.asignadoA,
        tarea.fechaDeEntrega,
        tarea.estado
      );
      tarjetasHtml.push(htmlTarjeta);
    }

    // 4. Insertamos el HTML generado en el contenedor
    contenedorLista.innerHTML = tarjetasHtml.join("\n");

    // Actualizamos el contador de tareas en la interfaz
    if (contadorElemento) {
      const total = this.tasks.length;
      contadorElemento.textContent = `${total} ${total === 1 ? "tarea" : "tareas"}`;
    }
  }
}

// Creamos la instancia principal del administrador de tareas
const taskManager = new TaskManager();

// ==========================================================================
// SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================================================
const formulario = document.querySelector("#formularioTarea");
const listaTareas = document.querySelector("#listaTareas");
const errores = document.querySelector("#errores");

// ==========================================================================
// FUNCIÓN QUE CREA EL HTML DE UNA TARJETA CON TEMPLATE LITERALS
// Recibe los datos de la tarea incluyendo su id único para data-task-id.
// ==========================================================================
function createTaskHtml(id, nombre, descripcion, asignadoA, fechaDeEntrega, estado) {
  // Determinamos la clase CSS correspondiente para el color del badge de estado
  let claseEstado = "estado-por-hacer";
  if (estado === "EN PROCESO") {
    claseEstado = "estado-en-proceso";
  } else if (estado === "REVISIÓN") {
    claseEstado = "estado-revision";
  } else if (estado === "HECHO") {
    claseEstado = "estado-hecho";
  }

  // Si la tarea ya se encuentra en estado HECHO, ocultamos el botón de completar
  const botonCompletarOculto = estado === "HECHO" ? "d-none" : "";

  // Retornamos el template literal con data-task-id y el botón con clase done-button
  return `
    <article class="card tarjeta-tarea" data-task-id="${id}">
      <div class="parte-superior">
        <h3>${nombre}</h3>
        <button type="button" class="boton-eliminar" aria-label="Eliminar tarea: ${nombre}">
          Eliminar
        </button>
      </div>

      <p>${descripcion}</p>

      <div class="detalles">
        <span><strong>Asignado a:</strong> ${asignadoA}</span>
        <span><strong>Entrega:</strong> ${fechaDeEntrega}</span>
      </div>

      <div class="pie-tarjeta">
        <span class="estado ${claseEstado}">${estado}</span>
        <button type="button" class="btn btn-sm btn-outline-success done-button ${botonCompletarOculto}">
          Marcar como hecho
        </button>
      </div>
    </article>
  `;
}

// ==========================================================================
// VALIDACIÓN DEL FORMULARIO DE TAREAS
// ==========================================================================
function validateTaskForm() {
  const nombre = document.querySelector("#nombre").value.trim();
  const descripcion = document.querySelector("#descripcion").value.trim();
  const asignadoA = document.querySelector("#asignadoA").value.trim();
  const fechaDeEntrega = document.querySelector("#fechaDeEntrega").value;
  const estado = document.querySelector("#estado").value;

  const mensajes = [];

  // Validaciones según rúbrica del proyecto
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

  // Mostramos u ocultamos la caja de mensajes de error
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

// ==========================================================================
// EVENTO SUBMIT DEL FORMULARIO
// ==========================================================================
formulario.addEventListener("submit", event => {
  event.preventDefault();

  // Si la validación falla, detenemos el proceso
  if (!validateTaskForm()) return;

  const formData = new FormData(formulario);

  // Agregamos la tarea a la clase TaskManager
  taskManager.addTask({
    nombre: formData.get("nombre").trim(),
    descripcion: formData.get("descripcion").trim(),
    asignadoA: formData.get("asignadoA").trim(),
    fechaDeEntrega: formData.get("fechaDeEntrega"),
    estado: formData.get("estado")
  });

  // Limpiamos los campos del formulario
  formulario.reset();

  // Refrescamos la pantalla con las tareas actualizadas
  taskManager.render();

  // TAREA 8 - PASO 2: Guardamos los cambios en localStorage después de agregar
  taskManager.save();
});

// ==========================================================================
// DELEGACIÓN DE EVENTOS EN LA LISTA DE TAREAS
// Escucha clicks en botones de completar y eliminar
// ==========================================================================
listaTareas.addEventListener("click", event => {
  // 1. Verificamos si se hizo clic en el botón de marcar como completada
  if (event.target.classList.contains("done-button")) {
    // Usamos recorrido del DOM para encontrar el elemento contenedor de la tarjeta
    const elementoTarea = event.target.closest(".tarjeta-tarea") || event.target.parentElement.parentElement;

    // Obtenemos el id del atributo de datos y lo convertimos a número
    const taskId = Number(elementoTarea.dataset.taskId);

    // Buscamos la tarea y cambiamos su estado a HECHO
    const tarea = taskManager.getTaskById(taskId);
    if (tarea) {
      tarea.estado = "HECHO";

      // Volvemos a dibujar la lista en pantalla
      taskManager.render();

      // TAREA 8 - PASO 2: Guardamos los cambios en localStorage después de actualizar el estado
      taskManager.save();
    }
  }

  // 2. Verificamos si se hizo clic en el botón de eliminar tarea
  if (event.target.classList.contains("boton-eliminar")) {
    const elementoTarea = event.target.closest(".tarjeta-tarea") || event.target.parentElement.parentElement;
    const taskId = Number(elementoTarea.dataset.taskId);

    // Eliminamos la tarea y refrescamos la vista
    taskManager.deleteTask(taskId);
    taskManager.render();

    // TAREA 8 - PASO 2: Guardamos los cambios en localStorage después de eliminar
    taskManager.save();
  }
});

// ==========================================================================
// TAREA 8 - PASO 4: Cargar las tareas al iniciar la aplicación
// El orden es importante:
// 1. Cargamos las tareas guardadas en localStorage (si existen)
// 2. Renderizamos para dibujarlas en pantalla
// ==========================================================================
taskManager.load();
taskManager.render();
