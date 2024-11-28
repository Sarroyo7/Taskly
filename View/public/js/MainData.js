// * ===============================================================================
//  !: Eventos de click
// * ===============================================================================

// Abrir modal para crear una nueva task
$('#create-task').on('click', function () {
    $('#createTaskModal').modal('show');
});

//Finalizar tarea
$(document).on('click', '.btn-finish-task', function () {
    let taskContainer = $(this).closest('.task-container');
    let descripcionTarea = taskContainer.find('.detalles-task').data('descripcion');
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas = tareas.filter(tarea => tarea.descripcion !== descripcionTarea);
    localStorage.setItem('tareas', JSON.stringify(tareas));

    Swal.fire({
        title: "¿Estás seguro de haber completado esta tarea?",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        icon: "question",
      }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Tarea finalizada con éxito.",
                showConfirmButton: false,
                timer: 1500
              });
            taskContainer.remove();
            if ($('.task-container').length == 0) {
                $('.txt-no-task').show();
            }
        } 
      });
});

//Editar tarea
$(document).on('click', '.btn-edit-task', function () {
    $('#editTaskModal').modal('show');
    
    //Obtener valores de la tarea seleccionada
    let taskContainer = $(this).closest('.task-container');
    let descripcionTarea = taskContainer.find('.detalles-task').data('descripcion');
    let fechaLimite = taskContainer.find('.detalles-task').data('fecha');
    let prioridad = taskContainer.find('.detalles-task').data('prioridad');

    //Asignar valores a los inputs del modal
    $('#descripcion-tarea-edit').val(descripcionTarea);
    $('#fecha-limite-edit').val(fechaLimite);
    $('#prioridad-edit').val(prioridad);
});

//Modal con detalle completo de las tareas
$(document).on('click', '.detalles-task', function () {
    let descripcionTarea = $(this).data('descripcion');
    let fechaLimite = $(this).data('fecha');
    let prioridad = $(this).data('prioridad');

    // Ajustar la fecha para evitar problemas de zona horaria
    let fecha = new Date(fechaLimite);
    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());

    // Formatear la fecha a "día/mes/año"
    let day = fecha.getDate().toString().padStart(2, '0');
    let month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    let year = fecha.getFullYear();
    let fechaFormateada = `${day}/${month}/${year}`;

    Swal.fire({
        title: 'Detalles de la tarea',
        html: `
            <p><strong><span class="txt-blue-pinted">Descripción:</span></strong> ${descripcionTarea}</p>
            <p><strong><span class="txt-blue-pinted">Fecha límite:</span></strong> ${fechaFormateada}</p>
            <p><strong><span class="txt-blue-pinted">Prioridad:</span></strong> ${prioridad}</p>
        `,
        icon: 'info'
    });
});

// * ===============================================================================
//  !: Evento para el envio del formulario de creacion y edicion de tareas
// * ===============================================================================

$("#create-task-form").on("submit", function (e) {
    e.preventDefault();

    //Obtenemos los valores de los inputs y los guardamos en variables
    let descripcionTarea = $('#descripcion-tarea').val();
    let fechaLimite = $('#fecha-limite').val();
    let prioridad = $('#prioridad').val();
    
    //Obtenemos la fecha actual
    let currentDay = new Date();
    let fechaActual = currentDay.getFullYear() + "-" + (currentDay.getMonth() + 1) + "-" + currentDay.getDate();
   
    //Validar que los campos no esten vacios
    if (descripcionTarea == "" || fechaLimite == "" || prioridad == "") {
        Swal.fire({
            title: "Advertencia",
            text: "Debes rellenar todos los campos.",
            icon: "warning",
        });
        return;
    } else {
        //Validar que la fecha limite sea mayor a la fecha actual
        if (fechaLimite < fechaActual) {
            Swal.fire({
                title: "Advertencia",
                text: "La fecha límite no puede ser menor a la fecha actual.",
                icon: "warning",
            });
            return;
        } else {
            $('#createTaskModal').modal('hide');
        }
    }

    // Crear objeto de tarea
    let task = {
        descripcion: descripcionTarea,
        fechaLimite: fechaLimite,
        prioridad: prioridad
    };

    // Guardar tarea en localStorage
    let tasks = JSON.parse(localStorage.getItem('tareas')) || [];
    tasks.push(task);
    localStorage.setItem('tareas', JSON.stringify(tasks));

    // Truncar la descripción a 15 caracteres si es necesario
    let descripcionCorta = descripcionTarea.length > 15 ? descripcionTarea.substring(0, 15) + '...' : descripcionTarea;

    //Hacer uso de append para agregar al body una nueva tarea a la lista
    $('.container-put-tasks').append(`
        <div class="task-container">     
        <div class="task">
            <p>${descripcionCorta}</p>
            <a class="detalles-task" data-descripcion="${descripcionTarea}" data-fecha="${fechaLimite}" data-prioridad="${prioridad}">Detalles</a>
        </div>
            <button class="btn-finish-task"><img src="View/public/img/finish-task-light.png" alt=""></button>
            <button class="btn-edit-task"><img src="View/public/img/edit-task-light.png" alt=""></button>
        </div>
    `);

    $('.txt-no-task').hide();
    //Reiniciar los valores del formulario
    $('#create-task-form').trigger('reset');
});

$("#edit-task-form").on("submit", function (e) {
    e.preventDefault();
    //Obtenemos los valores de los inputs y los guardamos en variables
    let descripcionTarea = $('#descripcion-tarea-edit').val();
    let fechaLimite = $('#fecha-limite-edit').val();
    let prioridad = $('#prioridad-edit').val();

    //Obtenemos la fecha actual
    let currentDay = new Date();
    let fechaActual = currentDay.getFullYear() + "-" + (currentDay.getMonth() + 1) + "-" + currentDay.getDate();
   
    //Validar que los campos no esten vacios
    if (descripcionTarea == "" || fechaLimite == "" || prioridad == "") {
        Swal.fire({
            title: "Advertencia",
            text: "Debes rellenar todos los campos.",
            icon: "warning",
        });
        return;
    } else {
        //Validar que la fecha limite sea mayor a la fecha actual
        if (fechaLimite < fechaActual) {
            Swal.fire({
                title: "Advertencia",
                text: "La fecha límite no puede ser menor a la fecha actual.",
                icon: "warning",
            });
            return;
        } else {
            $('#createTaskModal').modal('hide');
        }
    }
     
    //Reemplazar los datos de la tarea seleccionada por los nuevos datos
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    let taskContainer = $('.task-container');
    let descripcionTareaAnterior = taskContainer.find('.detalles-task').data('descripcion');
    tareas = tareas.filter(tarea => tarea.descripcion !== descripcionTareaAnterior);
    tareas.push({ 
        descripcion: descripcionTarea, 
        fechaLimite: fechaLimite, 
        prioridad: prioridad 
    });
    localStorage.setItem('tareas', JSON.stringify(tareas));

    //Reiniciar el contenedor para que se muestren los datos actualizados
    $('.container-put-tasks').html('');
    tareas.forEach(tarea => {
        let descripcionCorta = tarea.descripcion.length > 15 ? tarea.descripcion.substring(0, 15) + '...' : tarea.descripcion;
        $('.container-put-tasks').append(`
            <div class="task-container">
            <div class="task">
                <p>${descripcionCorta}</p>
                <a href="#" class="detalles-task" data-descripcion="${tarea.descripcion}" data-fecha="${tarea.fechaLimite}" data-prioridad="${tarea.prioridad}">Detalles</a>
            </div>
                <button class="btn-finish-task"><img src="View/public/img/finish-task-dark.png"></button>
                <button class="btn-edit-task"><img src="View/public/img/edit-task-dark.png"></button>
            </div>
        `);
            // Verificar el estado del modo y ajustar las imágenes de los botones
            if ($('html').hasClass('light-mode')) {
                $('.btn-finish-task img').attr('src', 'View/public/img/finish-task-dark.png');
                $('.btn-edit-task img').attr('src', 'View/public/img/edit-task-dark.png');
            } else {
                $('.btn-finish-task img').attr('src', 'View/public/img/finish-task-light.png');
                $('.btn-edit-task img').attr('src', 'View/public/img/edit-task-light.png');
            }
    });

    $('#editTaskModal').modal('hide');    
});

// * ===============================================================================
//  !: Eventos para cuando el documento este listo
// * ===============================================================================


// Cargar tareas desde localStorage al iniciar la aplicación
$(document).ready(function () {
    checkRemainder();

    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    if (tareas.length > 0) {
        $('.txt-no-task').hide();
        tareas.forEach(tarea => {
            let descripcionCorta = tarea.descripcion.length > 15 ? tarea.descripcion.substring(0, 15) + '...' : tarea.descripcion;
            $('.container-put-tasks').append(`
                <div class="task-container">     
                <div class="task">
                    <p>${descripcionCorta}</p>
                    <a href="#" class="detalles-task" data-descripcion="${tarea.descripcion}" data-fecha="${tarea.fechaLimite}" data-prioridad="${tarea.prioridad}">Detalles</a>
                </div>
                    <button class="btn-finish-task"><img src="View/public/img/finish-task-light.png" alt=""></button>
                    <button class="btn-edit-task"><img src="View/public/img/edit-task-light.png" alt=""></button>
                </div>
            `);
        });
    }

// Alternar entre modo oscuro y modo claro
$('.btn-settings').on('click', function () {
    $('html').toggleClass('light-mode');
    $('body').toggleClass('light-mode');
    $('body hr').toggleClass('light-mode');
    $('.navbar-container').toggleClass('light-mode');
    $('.welcome-container h1').toggleClass('light-mode');
    $('.welcome-container h2').toggleClass('light-mode');
    $('.txt-no-task').toggleClass('light-mode');

        // Cambiar la imagen del botón de configuración
        if ($('html').hasClass('light-mode')) {
            $('.btn-settings img').attr('src', 'View/public/img/switch-dark-mode.png');
            $('.btn-finish-task img').attr('src', 'View/public/img/finish-task-dark.png');
            $('.btn-edit-task img').attr('src', 'View/public/img/edit-task-dark.png');
        } else {
            $('.btn-settings img').attr('src', 'View/public/img/switch-light-mode.png');
            $('.btn-finish-task img').attr('src', 'View/public/img/finish-task-light.png');
            $('.btn-edit-task img').attr('src', 'View/public/img/edit-task-light.png');
        }
});

// Enviar notificacion si la tarea esta proxima a vencer y si las notificaciones estan permitidas
function checkRemainder() {
    const inputDate = new Date($('#fecha-limite').val());
    const currentDate = new Date();

    if (isNaN(inputDate.getTime())) {
        return; // Si no hay fecha, no se hace nada
    }

    const timeDiff = inputDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff <= 2 && daysDiff >= 0) {
        if (Notification.permission === 'granted') {
            new Notification('¡Atención!', {
                body: `La tarea "${$('#descripcion-tarea').val()}" está próxima a vencer.`
            });
        }
    } else if (daysDiff < 0) {
        if (Notification.permission === 'granted') {
            new Notification('¡Atención!', {
                body: `La tarea "${$('#descripcion-tarea').val()}" ha vencido.`
            });
        }
    } else {
        new Notification('¡Atención!', {
            body: `No hay recordatorios pendientes.`
        });
    }

    // Solicitar permiso de notificación al cargar la página
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    // Verificar la fecha ingresada cada 10 segundos
    setInterval(checkRemainder, 10000);

    // Tambien verificar al cambiar la fecha
    $('#fecha-limite').on('change', checkRemainder);
}


});