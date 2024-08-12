let getData = []; // Inicialmente vacío
let isEdit = false; // Variable para verificar si es edición
let editId = null; // Almacena el índice del empleado que se está editando

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
            <td>${'*'.repeat(empleado.persona.Contrasenia.length)}</td> <!-- Mostrar contraseña como ***** -->
            <td>
                <button class='btn btn-success' onclick='readInfo(${index})' data-bs-toggle='modal' data-bs-target='#readData'><i class='bi bi-eye'></i></button>
                <button class='btn btn-primary' onclick='editInfo(${index})' data-bs-toggle='modal' data-bs-target='#userForm'><i class='bi bi-pencil-square'></i></button>
                <button class='btn btn-danger' onclick='deleteInfo(${index})'><i class='bi bi-trash'></i></button>
            </td>
        </tr>`;
    });
    tabla.innerHTML = acumulador;
}

document.addEventListener("DOMContentLoaded", () => {
    // Cargar datos desde localStorage
    if (localStorage.getItem('empleados')) {
        getData = JSON.parse(localStorage.getItem('empleados'));
        cargarTabla();
    }
});

document.getElementById('myForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const sueldoField = document.querySelector('#sueldo');
    let sueldoValue = sueldoField.value;

    // Agregar el símbolo $ si no está presente
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
            sueldo: sueldoValue, // Guardar sueldo formateado
            Contrasenia: document.querySelector('#contrasenia').value // Guardar contraseña
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

    localStorage.setItem('empleados', JSON.stringify(getData));
    cargarTabla();

    // Limpiar el formulario
    document.getElementById('myForm').reset();
    document.querySelector('#sucursal').value = ''; // Limpiar el campo de sucursal

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('userForm'));
    modal.hide();
});

function readInfo(index) {
    const empleado = getData[index];
    document.querySelector('#showName').value = empleado.persona.nombre;
    document.querySelector('#showApellidoPaterno').value = empleado.persona.apellidoPaterno;
    document.querySelector('#showApellidoMaterno').value = empleado.persona.apellidoMaterno;
    document.querySelector('#showUsuario').value = empleado.persona.NombreDeUsuario;
    document.querySelector('#showTelefono').value = empleado.persona.telDomicilio;
    document.querySelector('#showSueldo').value = empleado.persona.sueldo;
    document.querySelector('#showSucursal').value = empleado.sucursal ? empleado.sucursal.sucursal : 'N/A';
    document.querySelector('#showContrasenia').value = empleado.persona.Contrasenia; // Mostrar contraseña en el modal
}

function editInfo(index) {
    const empleado = getData[index];
    document.querySelector('#name').value = empleado.persona.nombre;
    document.querySelector('#apellidoPaterno').value = empleado.persona.apellidoPaterno;
    document.querySelector('#apellidoMaterno').value = empleado.persona.apellidoMaterno;
    document.querySelector('#usuario').value = empleado.persona.NombreDeUsuario;
    document.querySelector('#telefono').value = empleado.persona.telDomicilio;
    document.querySelector('#sueldo').value = empleado.persona.sueldo.replace('$', '');
    document.querySelector('#sucursal').value = empleado.sucursal ? empleado.sucursal.sucursal : '';
    document.querySelector('#contrasenia').value = empleado.persona.Contrasenia; // Cargar contraseña para editar

    isEdit = true;
    editId = index;
}

function deleteInfo(index) {
    getData.splice(index, 1);
    localStorage.setItem('empleados', JSON.stringify(getData));
    cargarTabla();
}
