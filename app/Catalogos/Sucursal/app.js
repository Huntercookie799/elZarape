let getData = []; // Inicialmente vacío

function cargarTabla() {
    let tabla = document.getElementById('tbody');
    let acumulador = "";
    getData.forEach((sucursales, index) => {
        // Usa directamente el valor del campo 'logo' desde el JSON
        acumulador += `<tr>
            <td><img src="${sucursales.logo}" alt="" width="50" height="50"></td>
            <td>${sucursales.nombre}</td>
            <td>${sucursales.horario}</td>
            <td>${sucursales.ubicacion}</td>
            <td>
                <button class="btn" style="background-color: var(--primary-color-light); color: var(--text-color);" onclick='readInfo("${sucursales.logo}", "${sucursales.nombre}", "${sucursales.horario}", "${sucursales.ubicacion}")' data-bs-toggle='modal' data-bs-target='#readData'><i class='bi bi-eye'></i></button>
                <button class="btn" style="background-color: var(--sidebar-color); color: #fff;" onclick='editInfo(${index}, "${sucursales.logo}", "${sucursales.nombre}", "${sucursales.horario}", "${sucursales.ubicacion}")' data-bs-toggle='modal' data-bs-target='#userForm'><i class='bi bi-pencil-square'></i></button>
                <button class="btn" style="background-color: var(--toggle-color); color: #fff;" onclick='deleteInfo(${index})'><i class='bi bi-trash'></i></button>
            </td>
        </tr>`;
    });
    tabla.innerHTML = acumulador;
}


// Cargar los datos desde el archivo JSON o almacenamiento local
document.addEventListener('DOMContentLoaded', () => {
    const storedData = localStorage.getItem('sucursales');
    if (storedData) {
        getData = JSON.parse(storedData);
        cargarTabla();
    } else {
        fetch('sucursales.json') // Cambiado el nombre del archivo JSON
            .then(response => response.json())
            .then(data => {
                getData = data;
                localStorage.setItem('sucursales', JSON.stringify(getData)); // Guardar los datos en localStorage
                cargarTabla();
            })
            .catch(error => console.error('Error al cargar los datos:', error));
    }
});

// Función para mostrar información en el modal de lectura
function readInfo(pic, name, desc, cost) {
    document.querySelector('.showImg').src = pic;
    document.querySelector('#showName').value = name;
    document.querySelector('#showDescription').value = desc;
    document.querySelector('#showCost').value = cost;
}

// Función para editar información
function editInfo(index, pic, name, desc, cost) {
    isEdit = true;
    editId = index;
    document.querySelector('.img').src = pic;
    document.querySelector('#name').value = name;
    document.querySelector('#description').value = desc;
    document.querySelector('#cost').value = cost;
    document.querySelector('.submit').innerText = "Actualizar Sucursal";
    document.querySelector('#userForm .modal-title').innerText = "Actualizar Sucursal";
}

// Función para eliminar información
function deleteInfo(index) {
    if (confirm("¿Estás seguro de que deseas eliminar?")) {
        getData.splice(index, 1);
        localStorage.setItem("sucursales", JSON.stringify(getData));
        cargarTabla();
    }
}

// Guardar o actualizar la sucursal
let isEdit = false;
let editId = null;

document.getElementById('myForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const information = {
        logo: document.querySelector('#imgInput').files.length > 0 ? URL.createObjectURL(document.querySelector('#imgInput').files[0]) : document.querySelector('.img').src,
        nombre: document.querySelector('#name').value,
        horario: document.querySelector('#description').value,
        ubicacion: document.querySelector('#cost').value
    };

    if (!isEdit) {
        getData.push(information);
    } else {
        isEdit = false;
        getData[editId] = information;
    }

    localStorage.setItem('sucursales', JSON.stringify(getData));
    document.querySelector('.submit').innerText = "Agregar Sucursal";
    document.querySelector('#userForm .modal-title').innerText = "Agregar Nueva Sucursal";
    cargarTabla();
    document.getElementById('myForm').reset();
    document.querySelector('.img').src = "img/paz.jpg"; // Imagen predeterminada
});
