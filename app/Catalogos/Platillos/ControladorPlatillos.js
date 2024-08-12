let getData = []; // Inicialmente vacío

function cargarTabla() {
    let tabla = document.getElementById('tbody');
    let acumulador = "";
    getData.forEach((platillos, index) => {
        acumulador += `<tr>
            <td><img src="${platillos.Foto}" alt="" width="50" height="50"></td>
            <td>${platillos.Nombre}</td>
            <td>${platillos.Descripcion}</td>
            <td>${platillos.Costo}</td>
            <td>
                <button class="btn" style="background-color: var(--primary-color-light); color: var(--text-color);" onclick='readInfo("${platillos.Foto}", "${platillos.Nombre}", "${platillos.Descripcion}", "${platillos.Costo}")' data-bs-toggle='modal' data-bs-target='#readData'><i class='bi bi-eye'></i></button>
                <button class="btn" style="background-color: var(--sidebar-color); color: #fff;" onclick='editInfo(${index}, "${platillos.Foto}", "${platillos.Nombre}", "${platillos.Descripcion}", "${platillos.Costo}")' data-bs-toggle='modal' data-bs-target='#userForm'><i class='bi bi-pencil-square'></i></button>
                <button class="btn" style="background-color: var(--toggle-color); color: #fff;" onclick='deleteInfo(${index})'><i class='bi bi-trash'></i></button>
            </td>
        </tr>`;
    });
    tabla.innerHTML = acumulador;
}

// Cargar los datos desde el archivo JSON o almacenamiento local
document.addEventListener('DOMContentLoaded', () => {
    const storedData = localStorage.getItem('platillos');
    if (storedData) {
        getData = JSON.parse(storedData);
        cargarTabla();
    } else {
        fetch('DataPlatillos.json')  // Cambiado el nombre del archivo JSON
            .then(response => response.json())
            .then(data => {
                getData = data;
                localStorage.setItem('platillos', JSON.stringify(getData)); // Guardar los datos en localStorage
                cargarTabla();
            })
            .catch(error => console.error('Error al cargar los datos:', error));
    }
});

// Función para mostrar información en el modal de lectura
function readInfo(pic, name, desc, cost) {
    console.log("Pic:", pic);
    console.log("Name:", name);
    console.log("Description:", desc);
    console.log("Cost:", cost);

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
    document.querySelector('#cost').value = cost; // Asegúrate de que este campo esté configurado correctamente
    document.querySelector('.submit').innerText = "Actualizar Platillo";
    document.querySelector('#userForm .modal-title').innerText = "Actualizar Platillo";
}


// Función para eliminar información
function deleteInfo(index) {
    if (confirm("¿Estás seguro de que deseas eliminar?")) {
        getData.splice(index, 1);
        localStorage.setItem("platillos", JSON.stringify(getData));
        cargarTabla();
    }
}

// Guardar o actualizar el platillo
let isEdit = false;
let editId = null;

document.getElementById('myForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const information = {
        Foto: document.querySelector('#imgInput').files.length > 0 ? URL.createObjectURL(document.querySelector('#imgInput').files[0]) : document.querySelector('.img').src,
        Nombre: document.querySelector('#name').value,
        Descripcion: document.querySelector('#description').value,
        Costo: document.querySelector('#cost').value
    };

    if (!isEdit) {
        getData.push(information);
    } else {
        isEdit = false;
        getData[editId] = information;
    }

    localStorage.setItem('platillos', JSON.stringify(getData));
    document.querySelector('.submit').innerText = "Agregar Platillo";
    document.querySelector('#userForm .modal-title').innerText = "Agregar Nuevo Platillo";
    cargarTabla();
    document.getElementById('myForm').reset();
    document.querySelector('.img').src = "img/paz.jpg";  // Imagen predeterminada
});
