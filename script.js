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
        asignadoA: "Fernanda Doria",
        fechaDeEntrega: "2026-10-25",
        estado: "EN PROCESO"
      },
      {
        id: 3,
        nombre: "Revisar los requisitos del sprint",
        descripcion: "Leer la guía y comprobar cada punto de la rúbrica.",
        asignadoA: "Mery Gómez",
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

  // ------------------------------------------------------------------------
  // Función 1: AGREGAR TAREA (addTask)
  // Agrega una nueva tarea a la lista con un id único generado
  // ------------------------------------------------------------------------
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

  // ------------------------------------------------------------------------
  // Función 2: ELIMINAR TAREA (deleteTask)
  // Elimina una tarea comparando por su identificador numérico
  // ------------------------------------------------------------------------
  deleteTask(taskId) {
    const longitudInicial = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== Number(taskId));
    return this.tasks.length < longitudInicial;
  }

  // ------------------------------------------------------------------------
  // Función 3: ACTUALIZAR TAREA (updateTask)
  // Actualiza los datos o el estado de una tarea existente en TaskManager
  // ------------------------------------------------------------------------
  updateTask(taskId, nuevosDatos) {
    const task = this.getTaskById(Number(taskId));
    if (!task) return false;

    // Si recibimos un objeto con los campos actualizados del formulario
    if (typeof nuevosDatos === "object" && nuevosDatos !== null) {
      if (nuevosDatos.nombre !== undefined) task.nombre = nuevosDatos.nombre;
      if (nuevosDatos.descripcion !== undefined) task.descripcion = nuevosDatos.descripcion;
      if (nuevosDatos.asignadoA !== undefined) task.asignadoA = nuevosDatos.asignadoA;
      if (nuevosDatos.fechaDeEntrega !== undefined) task.fechaDeEntrega = nuevosDatos.fechaDeEntrega;
      if (nuevosDatos.estado !== undefined) task.estado = nuevosDatos.estado;
    } else if (typeof nuevosDatos === "string") {
      // Si se pasa un string, actualizamos directamente el estado
      task.estado = nuevosDatos;
    }

    return true;
  }

  // ------------------------------------------------------------------------
  // Función 4: ASIGNAR TAREA (assignTask)
  // Asigna una tarea a una persona diferente
  // ------------------------------------------------------------------------
  assignTask(taskId, assignee) {
    const task = this.getTaskById(Number(taskId));
    if (!task) return false;

    task.asignadoA = assignee;
    return true;
  }

  // ------------------------------------------------------------------------
  // Método para buscar una tarea por su id
  // Recibe el id numérico y recorre this.tasks para encontrarla y retornarla.
  // ------------------------------------------------------------------------
  getTaskById(taskId) {
    let tareaEncontrada;

    // Recorremos el arreglo de tareas
    for (let i = 0; i < this.tasks.length; i++) {
      const tareaActual = this.tasks[i];

      // Comparamos el id de la tarea actual con el id recibido
      if (tareaActual.id === taskId) {
        tareaEncontrada = tareaActual;
      }
    }

    return tareaEncontrada;
  }

  // ------------------------------------------------------------------------
  // LOCALSTORAGE: Guardar las tareas
  // Convierte el arreglo de tareas y el contador de IDs en texto JSON y los guarda.
  // ------------------------------------------------------------------------
  save() {
    if (typeof localStorage === "undefined") return;

    // 1. Convertimos el arreglo this.tasks a string JSON
    const tasksJson = JSON.stringify(this.tasks);

    // 2. Guardamos las tareas con la clave 'tasks'
    localStorage.setItem("tasks", tasksJson);

    // 3. Convertimos el contador de ID a string y lo guardamos con la clave 'currentId'
    const currentIdString = String(this.currentId);
    localStorage.setItem("currentId", currentIdString);
  }

  // ------------------------------------------------------------------------
  // LOCALSTORAGE: Cargar las tareas
  // Si hay datos guardados previamente en el navegador, los recupera y asigna.
  // ------------------------------------------------------------------------
  load() {
    if (typeof localStorage === "undefined") return;

    // 1. Verificamos si hay tareas guardadas en localStorage
    const tasksJson = localStorage.getItem("tasks");

    if (tasksJson) {
      this.tasks = JSON.parse(tasksJson);
    } else {
      // Si es la primera vez y no hay nada guardado, guardamos las tareas iniciales
      this.save();
    }

    // 2. Verificamos si está guardado el contador de IDs
    const currentIdString = localStorage.getItem("currentId");

    if (currentIdString) {
      this.currentId = Number(currentIdString);
    }
  }

  // ------------------------------------------------------------------------
  // RENDERIZADO:
  // Limpia el contenedor y dibuja todas las tarjetas en pantalla.
  // ------------------------------------------------------------------------
  render() {
    if (typeof document === "undefined") return;

    const contenedorLista = document.querySelector("#listaTareas");
    const contadorElemento = document.querySelector("#cantidadTareas");
    if (!contenedorLista) return;

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

  return `
    <article class="card tarjeta-tarea" data-task-id="${id}">
      <div class="parte-superior">
        <h3>${nombre}</h3>
        <div class="acciones-superiores">
          <button type="button" class="btn btn-sm btn-outline-secondary btn-editar" title="Editar tarea">
            Editar
          </button>
          <button type="button" class="boton-eliminar" aria-label="Eliminar tarea: ${nombre}">
            Eliminar
          </button>
        </div>
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

// Variable global para recordar qué tarea estamos editando (null si estamos agregando)
let idTareaEnEdicion = null;

// ==========================================================================
// LÓGICA DEL DOM (solo se ejecuta si estamos en el navegador)
// ==========================================================================
if (typeof document !== "undefined") {
  const taskManager = new TaskManager();

  const formulario = document.querySelector("#formularioTarea");
  const listaTareas = document.querySelector("#listaTareas");
  const errores = document.querySelector("#errores");
  const botonGuardar = document.querySelector("#botonGuardar");

  // Validación del formulario de tareas
  function validateTaskForm() {
    const nombre = document.querySelector("#nombre").value.trim();
    const descripcion = document.querySelector("#descripcion").value.trim();
    const asignadoA = document.querySelector("#asignadoA").value.trim();
    const fechaDeEntrega = document.querySelector("#fechaDeEntrega").value;
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

  // ------------------------------------------------------------------------
  // EVENTO SUBMIT DEL FORMULARIO
  // Guarda una tarea nueva o actualiza una existente según la rúbrica
  // ------------------------------------------------------------------------
  formulario.addEventListener("submit", event => {
    event.preventDefault();

    if (!validateTaskForm()) return;

    const formData = new FormData(formulario);
    const datosTarea = {
      nombre: formData.get("nombre").trim(),
      descripcion: formData.get("descripcion").trim(),
      asignadoA: formData.get("asignadoA").trim(),
      fechaDeEntrega: formData.get("fechaDeEntrega"),
      estado: formData.get("estado")
    };

    if (idTareaEnEdicion !== null) {

      // --------------------------------------------------------------------
      taskManager.updateTask(idTareaEnEdicion, datosTarea);

      // Cuando la tarea se actualiza, el botón vuelve a llamarse "guardar"
      botonGuardar.textContent = "guardar";

      // Limpiamos la variable de edición
      idTareaEnEdicion = null;
    } else {
      // MODO AGREGAR: agregamos la nueva tarea
      taskManager.addTask(datosTarea);
    }

    // Los campos del formulario deben quedar vacíos nuevamente
    formulario.reset();

    // Actualizamos la vista y guardamos en LocalStorage
    taskManager.render();
    taskManager.save();
  });

  // ------------------------------------------------------------------------
  // DELEGACIÓN DE EVENTOS EN LA LISTA DE TAREAS
  // ------------------------------------------------------------------------
  listaTareas.addEventListener("click", event => {
    // 1. EDITAR / ACTUALIZAR TAREA (según la rúbrica):
    // Al hacer clic en una tarea (o en su botón Editar), la información se muestra
    // en el formulario y el botón de guardar cambia a "actualización".
    const clicEnEditar = event.target.closest(".btn-editar");
    const tarjetaClickeada = event.target.closest(".tarjeta-tarea");

    if (clicEnEditar || (tarjetaClickeada && !event.target.closest(".boton-eliminar") && !event.target.closest(".done-button"))) {
      const elementoTarea = tarjetaClickeada;
      const taskId = Number(elementoTarea.dataset.taskId);
      const tarea = taskManager.getTaskById(taskId);

      if (tarea) {
        // Cargar los datos de la tarea seleccionada en el formulario
        const campoNombre = document.querySelector("#nombre");
        const campoDescripcion = document.querySelector("#descripcion");
        const campoAsignado = document.querySelector("#asignadoA");
        const campoFecha = document.querySelector("#fechaDeEntrega");
        const campoEstado = document.querySelector("#estado");

        if (campoNombre) campoNombre.value = tarea.nombre;
        if (campoDescripcion) campoDescripcion.value = tarea.descripcion;
        if (campoAsignado) campoAsignado.value = tarea.asignadoA;
        if (campoFecha) campoFecha.value = tarea.fechaDeEntrega;
        if (campoEstado) campoEstado.value = tarea.estado;


        // Guardamos el id de la tarea que estamos editando
        idTareaEnEdicion = tarea.id;

        // El botón de guardar cambia de nombre a "actualización"
        botonGuardar.textContent = "actualización";

        // Desplazamos suavemente al formulario para comodidad del usuario
        formulario.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // 2. MARCAR COMO HECHO:
    if (event.target.classList.contains("done-button")) {
      const elementoTarea = event.target.closest(".tarjeta-tarea") || event.target.parentElement.parentElement;
      const taskId = Number(elementoTarea.dataset.taskId);
      const tarea = taskManager.getTaskById(taskId);

      if (tarea) {
        tarea.estado = "HECHO";
        taskManager.render();
        taskManager.save();
      }
      return;
    }

    // 3. ELIMINAR TAREA:
    if (event.target.classList.contains("boton-eliminar")) {
      const elementoTarea = event.target.closest(".tarjeta-tarea") || event.target.parentElement.parentElement;
      const taskId = Number(elementoTarea.dataset.taskId);

      taskManager.deleteTask(taskId);
      taskManager.render();
      taskManager.save();
    }
  });

  // CARGA INICIAL:
  // 1. Carga desde localStorage
  // 2. Renderiza en pantalla
  taskManager.load();
  taskManager.render();
}

// ==========================================================================
// EXPORTACIÓN PARA PRUEBAS UNITARIAS (Node.js / Jest / node:test)
// ==========================================================================
if (typeof module !== "undefined" && module.exports) {
  module.exports = { TaskManager, createTaskHtml };
}
