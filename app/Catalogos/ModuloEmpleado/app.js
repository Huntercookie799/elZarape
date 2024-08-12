let getData = [];
let isEdit = false;
let editId = null;

// Cargar datos desde el archivo JSON al iniciar la página
function cargarDatos() {
    fetch('DataEmpleados.json')
        .then(response => response.json())
        .then(data => {
            getData = data;
            cargarTabla();
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}

// Cargar y mostrar datos en la tabla
function cargarTabla() {
    let tabla = document.getElementById('tbody');
    let acumulador = "";
    getData.forEach((empleado, index) => {
        acumulador += `<tr>
            <td>${empleado.persona.nombre}</td>
            <td>${empleado.persona.apellidoPaterno}</td>
            <td>${empleado.persona.apellidoMaterno}</td>
            <td>${empleado.persona.NombreDeUsuario}</td>
            <td>${empleado.persona.telDomicilio}</td>
            <td>${empleado.persona.sueldo}</td>
            <td>${empleado.sucursal ? empleado.sucursal.sucursal : 'N/A'}</td>
            <td>${'*'.repeat(empleado.persona.Contrasenia.length)}</td>
            <td>
                <button class="btn" style="background-color: var(--primary-color-light); color: var(--text-color);" onclick='readInfo("${sucursales.logo}", "${sucursales.nombre}", "${sucursales.horario}", "${sucursales.ubicacion}")' data-bs-toggle='modal' data-bs-target='#readData'><i class='bi bi-eye'></i></button>
                <button class="btn" style="background-color: var(--sidebar-color); color: #fff;" onclick='editInfo(${index}, "${sucursales.logo}", "${sucursales.nombre}", "${sucursales.horario}", "${sucursales.ubicacion}")' data-bs-toggle='modal' data-bs-target='#userForm'><i class='bi bi-pencil-square'></i></button>
                <button class="btn" style="background-color: var(--toggle-color); color: #fff;" onclick='deleteInfo(${index})'><i class='bi bi-trash'></i></button>
            </td>
        </tr>`;
    });
    tabla.innerHTML = acumulador;
}

// Inicializar datos cuando el documento esté listo
document.addEventListener("DOMContentLoaded", () => {
    cargarDatos();
});

// Manejar el envío del formulario (agregar o editar empleados)
document.getElementById('myForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const sueldoField = document.querySelector('#sueldo');
    let sueldoValue = sueldoField.value;

    if (!sueldoValue.startsWith('$')) {
        sueldoValue = `$${sueldoValue}`;
    }

    const information = {
        persona: {
            nombre: document.querySelector('#name').value,
            apellidoPaterno: document.querySelector('#apellidoPaterno').value,
            apellidoMaterno: document.querySelector('#apellidoMaterno').value,
            NombreDeUsuario: document.querySelector('#usuario').value,
            telDomicilio: document.querySelector('#telefono').value,
            sueldo: sueldoValue,
            Contrasenia: document.querySelector('#contrasenia').value
        },
        sucursal: {
            sucursal: document.querySelector('#sucursal').value
        }
    };

    if (!isEdit) {
        getData.push(information);
    } else {
        getData[editId] = information;
        isEdit = false;
        editId = null;
    }

    cargarTabla();

    // Limpiar el formulario
    document.getElementById('myForm').reset();
    document.querySelector('#sucursal').value = '';

    const modal = bootstrap.Modal.getInstance(document.getElementById('userForm'));
    modal.hide();
});

// Mostrar información de un empleado en el modal de vista
function readInfo(index) {
    const empleado = getData[index];
    document.querySelector('#showName').value = empleado.persona.nombre;
    document.querySelector('#showApellidoPaterno').value = empleado.persona.apellidoPaterno;
    document.querySelector('#showApellidoMaterno').value = empleado.persona.apellidoMaterno;
    document.querySelector('#showUsuario').value = empleado.persona.NombreDeUsuario;
    document.querySelector('#showTelefono').value = empleado.persona.telDomicilio;
    document.querySelector('#showSueldo').value = empleado.persona.sueldo;
    document.querySelector('#showSucursal').value = empleado.sucursal ? empleado.sucursal.sucursal : 'N/A';
    document.querySelector('#showContrasenia').value = empleado.persona.Contrasenia;
}

// Preparar el formulario para editar un empleado
function editInfo(index) {
    const empleado = getData[index];
    document.querySelector('#name').value = empleado.persona.nombre;
    document.querySelector('#apellidoPaterno').value = empleado.persona.apellidoPaterno;
    document.querySelector('#apellidoMaterno').value = empleado.persona.apellidoMaterno;
    document.querySelector('#usuario').value = empleado.persona.NombreDeUsuario;
    document.querySelector('#telefono').value = empleado.persona.telDomicilio;
    document.querySelector('#sueldo').value = empleado.persona.sueldo.replace('$', '');
    document.querySelector('#sucursal').value = empleado.sucursal ? empleado.sucursal.sucursal : '';
    document.querySelector('#contrasenia').value = empleado.persona.Contrasenia;

    isEdit = true;
    editId = index;
}

// Eliminar un empleado
function deleteInfo(index) {
    getData.splice(index, 1);
    cargarTabla();
}

