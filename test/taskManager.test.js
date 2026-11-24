const { describe, it } = require("node:test");
const assert = require("node:assert");
const { TaskManager, createTaskHtml } = require("../script.js");

// ==========================================================================
// RÚBRICA: PRUEBAS UNITARIAS DE LA CLASE TASKMANAGER (4 funciones)
// ==========================================================================
describe("Pruebas Unitarias - Clase TaskManager", () => {
  // 1. Agregar tarea (addTask)
  it("debe agregar una nueva tarea a la lista (addTask)", () => {
    const taskManager = new TaskManager();
    const cantidadInicial = taskManager.getAllTasks().length;

    const nuevaTarea = taskManager.addTask({
      nombre: "Aprender pruebas unitarias en JS",
      descripcion: "Comprobar que todas las funciones de TaskManager respondan bien.",
      asignadoA: "Luisa Sepulveda",
      fechaDeEntrega: "2026-11-30",
      estado: "POR HACER"
    });

    // Verificamos que la lista aumentó en 1
    assert.strictEqual(taskManager.getAllTasks().length, cantidadInicial + 1);
    // Verificamos que el objeto tiene los datos correctos y un id asignado
    assert.strictEqual(nuevaTarea.nombre, "Aprender pruebas unitarias en JS");
    assert.ok(nuevaTarea.id > 0);
  });

  // 2. Eliminar tarea (deleteTask)
  it("debe eliminar una tarea existente por su id (deleteTask)", () => {
    const taskManager = new TaskManager();
    const tareaAEliminar = taskManager.getAllTasks()[0];
    const cantidadInicial = taskManager.getAllTasks().length;

    const resultado = taskManager.deleteTask(tareaAEliminar.id);

    // Debe retornar true indicando que se eliminó
    assert.strictEqual(resultado, true);
    // La cantidad total debe haber disminuido en 1
    assert.strictEqual(taskManager.getAllTasks().length, cantidadInicial - 1);
    // Ya no debe encontrarse al buscarla por su ID
    assert.strictEqual(taskManager.getTaskById(tareaAEliminar.id), undefined);
  });

  // 3. Actualizar tarea (updateTask)
  it("debe actualizar los datos de una tarea existente (updateTask)", () => {
    const taskManager = new TaskManager();
    const tarea = taskManager.getAllTasks()[0];

    const actualizado = taskManager.updateTask(tarea.id, {
      nombre: "Nombre de tarea actualizado",
      descripcion: "Nueva descripción con más de quince caracteres requeridos.",
      asignadoA: "Persona Modificada",
      fechaDeEntrega: "2026-12-05",
      estado: "HECHO"
    });

    assert.strictEqual(actualizado, true);
    const tareaModificada = taskManager.getTaskById(tarea.id);
    assert.strictEqual(tareaModificada.nombre, "Nombre de tarea actualizado");
    assert.strictEqual(tareaModificada.estado, "HECHO");
  });

  // 4. Asignar tarea (assignTask)
  it("debe asignar la tarea a una persona diferente (assignTask)", () => {
    const taskManager = new TaskManager();
    const tarea = taskManager.getAllTasks()[0];

    const asignado = taskManager.assignTask(tarea.id, "Carlos Mendoza");

    assert.strictEqual(asignado, true);
    const tareaModificada = taskManager.getTaskById(tarea.id);
    assert.strictEqual(tareaModificada.asignadoA, "Carlos Mendoza");
  });
});

// ==========================================================================
// RÚBRICA: PRUEBAS DE LA INTERFAZ DE USUARIO (UI)
// ==========================================================================
describe("Pruebas Unitarias - Funciones de UI (HTML)", () => {
  // 5. Verificar que al agregar una tarea, esta se incluya en el componente de lista HTML
  it("debe incluir la tarea en el componente de lista HTML al agregarla", () => {
    const taskManager = new TaskManager();
    const tareaPrueba = {
      id: 100,
      nombre: "Tarea para prueba de UI HTML",
      descripcion: "Verificar que el componente contenga el texto y el id.",
      asignadoA: "Luisa Sepulveda",
      fechaDeEntrega: "2026-11-28",
      estado: "EN PROCESO"
    };

    // Generamos la tarjeta HTML con la función createTaskHtml
    const htmlTarjeta = createTaskHtml(
      tareaPrueba.id,
      tareaPrueba.nombre,
      tareaPrueba.descripcion,
      tareaPrueba.asignadoA,
      tareaPrueba.fechaDeEntrega,
      tareaPrueba.estado
    );

    // Verificamos que el componente incluya el atributo data-task-id y los datos
    assert.ok(htmlTarjeta.includes('data-task-id="100"'));
    assert.ok(htmlTarjeta.includes("Tarea para prueba de UI HTML"));
    assert.ok(htmlTarjeta.includes("Luisa Sepulveda"));
    assert.ok(htmlTarjeta.includes("EN PROCESO"));
  });

  // 6. Verificar que al eliminar una tarea, esta se elimine del componente de lista HTML
  it("debe remover la tarea del componente de lista HTML al eliminarla", () => {
    const taskManager = new TaskManager();

    // Agregamos una tarea
    const tareaTemporal = taskManager.addTask({
      nombre: "Tarea temporal para borrar",
      descripcion: "Esta tarea debe desaparecer del HTML renderizado.",
      asignadoA: "Tester",
      fechaDeEntrega: "2026-11-29",
      estado: "POR HACER"
    });

    // Simulamos la lista completa de HTML antes de eliminar
    let htmlLista = taskManager.getAllTasks().map(t =>
      createTaskHtml(t.id, t.nombre, t.descripcion, t.asignadoA, t.fechaDeEntrega, t.estado)
    ).join("\n");

    // Comprobamos que sí existe en el HTML
    assert.ok(htmlLista.includes(`data-task-id="${tareaTemporal.id}"`));

    // Eliminamos la tarea
    taskManager.deleteTask(tareaTemporal.id);

    // Volvemos a generar la lista HTML (lo que hace render())
    htmlLista = taskManager.getAllTasks().map(t =>
      createTaskHtml(t.id, t.nombre, t.descripcion, t.asignadoA, t.fechaDeEntrega, t.estado)
    ).join("\n");

    // Verificamos que ya NO está presente en el componente de lista HTML
    assert.strictEqual(htmlLista.includes(`data-task-id="${tareaTemporal.id}"`), false);
  });
});
