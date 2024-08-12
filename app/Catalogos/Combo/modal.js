let id_combo;
let esEditableForm;

async function fetchArticulos() {
    try {
        const response = await fetch('articulos.json');
        if (!response.ok) throw new Error('Error en la carga de artículos');
        const data = await response.json();
        return data;
    } catch (error) {
        mostrarError('Error al cargar los artículos', 'No se pudieron cargar los datos de los artículos.');
        return []; // Retorna un array vacío en caso de error
    }
}

async function fetchData() {
    let datosJson = JSON.parse(localStorage.getItem('combos')) || [];

    if (datosJson.length === 0) {
        try {
            const response = await fetch('datos.json');
            datosJson = await response.json();

            localStorage.setItem('combos', JSON.stringify(datosJson));
        } catch (error) {
            mostrarError('Error al cargar los datos', 'No se pudieron cargar los datos de los combos.');
            return [];
        }
    }else{
        return datosJson;
    }
}

async function fillForm(comboId, esEditable = false) {
    esEditableForm = esEditable;
    id_combo = comboId;
    const data = await fetchData();
    const combo = data.find(comb => comb.combo_id == comboId);
    if (combo) {
        document.getElementById('comboName').value = combo.combo_nombre;
        document.getElementById('descripcion').value = combo.combo_descripcion;
        document.getElementById('precio').value = combo.combo_precio;
        if (combo.foto) {
            document.getElementById('imgPreview').src = combo.foto;
        } else {
            document.getElementById('imgPreview').src = 'img/combo.png';
        }

        const tableBody = document.getElementById('dataEdit');
        tableBody.innerHTML = '';

        for (const articulo of combo.combo_articulos) {
            await addRow(
                articulo.tipo_producto.tipo_producto,
                articulo.categoria_producto.categoria,
                articulo.nombre_articulo,
                articulo.cantidad_producto,
                esEditable
            );
        }
        saveAllRows();

        if (esEditable) {
            habilitarControles();
        }
    }
}

async function saveCombo() {
    const comboName = document.getElementById('comboName').value;
    const precio = parseFloat(document.getElementById('precio').value);

    if (!comboName || isNaN(precio)) {
        mostrarError('Campos incompletos', 'Por favor, complete todos los campos correctamente.');
        return;
    }

    // Obtener combos existentes desde localStorage
    let combos = JSON.parse(localStorage.getItem('combos')) || [];

    // Crear el nuevo combo
    const newCombo = createComboObject(id_combo);

    if (esEditableForm) {
        // Si está en modo edición, buscar el combo para actualizarlo
        const combo = combos.find(combo => combo.combo_id == id_combo);
        if (!combo) {
            mostrarError('Error al actualizar el combo', 'No se encontró el combo para actualizar.');
            return;
        }
    
        // Actualizar las propiedades del combo existente
        Object.assign(combo, newCombo);
    } else {
        // Verificar si el nombre del combo ya existe
        const exists = combos.some(combo => combo.combo_nombre == document.getElementById('comboName').value);
        if (exists) {
            mostrarError('Nombre de combo duplicado', 'Ya existe un combo con ese Nombre. Por favor, elija otro Nombre.');
            return;
        }
    
        // Agregar el nuevo combo
        combos.push(newCombo);
    }    

    // Guardar los combos actualizados en localStorage
    localStorage.setItem('combos', JSON.stringify(combos));

    // Guardar la imagen con el ID del combo
    const imgInput = document.getElementById('imgInput');
    if (imgInput.files.length > 0) {
        const file = imgInput.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result.replace(/^data:.+;base64,/, '');
            localStorage.setItem(`comboImage_${comboId}`, base64String);
        };

        reader.readAsDataURL(file);
    }

    mostrarExito('Combo guardado correctamente', 'El combo ha sido guardado exitosamente.');

    // Llamar a la función para recargar los datos
    cargarDatos();

    // Cerrar el modal
    const modalElement = document.getElementById('userForm');
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    }
}

function createComboObject(comboId) {
    // Obtener la lista de artículos desde el archivo JSON
    const articulosData = fetchArticulosSync();

    const articulos = [];
    const rows = document.querySelectorAll('#dataEdit tr');
    for (const row of rows) {
        const tipo = row.querySelector('.tipo-cell').textContent;
        const categoria = row.querySelector('.categoria-cell').textContent;
        const nombre = row.querySelector('.nombre-text').textContent;
        const cantidad = row.querySelector('.cantidad-text').textContent;

        // Buscar la descripción del artículo
        const articulo = articulosData.find(a => a.nombre_articulo == nombre);
        const descripcionArticulo = articulo ? articulo.descripcion_articulo : '';

        articulos.push({
            tipo_producto: { tipo_producto: tipo },
            nombre_articulo: nombre,
            cantidad_producto: cantidad,
            categoria_producto: { categoria: categoria },
            descripcion_articulo: descripcionArticulo
        });
    }

    return {
        combo_id: comboId,
        combo_nombre: document.getElementById('comboName').value,
        combo_precio: parseFloat(document.getElementById('precio').value),
        combo_articulos: articulos,
        combo_descripcion: document.getElementById('descripcion').value,
        foto: document.getElementById('imgPreview').src
    };
}

function fetchArticulosSync() {
    let articulosData = [];
    fetch('articulos.json')
        .then(response => response.json())
        .then(data => articulosData = data)
        .catch(error => mostrarError('Error al cargar los artículos', 'No se pudieron cargar los datos de los artículos.'));
    return articulosData;
}

async function editCombo(comboId) {
    habilitarControles();
    await fillForm(comboId, true);
}

async function viewCombo(comboId) {
    solovercontroles();
    await fillForm(comboId);
}

function saveAllRows() {
    const rows = document.querySelectorAll('#dataEdit tr');

    rows.forEach(row => {
        const saveBtn = row.querySelector('.save-btn');
        if (saveBtn && !saveBtn.classList.contains('d-none')) {
            saveRow(row);
        }
    });
}

async function nuevoRegistro() {
    document.getElementById('comboName').disabled = false;
    habilitarControles();
    limpiarModal();
    addNewRow();
    id_combo = nuevoConseutivo();
    esEditableForm = false;
}

function nuevoConseutivo() {
    let combos = JSON.parse(localStorage.getItem('combos')) || [];
    const maxId = combos.length > 0 ? Math.max(...combos.map(combo => combo.combo_id)) : 0;

    const nuevoComboId = maxId + 1;

    return nuevoComboId;
}

async function addNewRow() {
    if (!areAllRowsSaved()) {
        mostrarAlerta('Fila no guardada', 'Por favor, guarda todas las filas antes de agregar una nueva.');
        return;
    }
    await addRow("", "", "", "", true);
}


function limpiarModal() {
    document.getElementById('comboName').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('imgPreview').src ='img/combo.png';

    const tableBody = document.getElementById('dataEdit');
    tableBody.innerHTML = '';
    habilitarControles();
}

function habilitarControles() {
    document.getElementById('comboName').disabled = false;
    document.getElementById('descripcion').disabled = false;
    document.getElementById('precio').disabled = false;
    document.getElementById('imgInput').disabled = false;

    document.getElementById('addRowBtn').disabled = false;
    document.getElementById('submitBtn').disabled = false;
}

function solovercontroles() {
    document.getElementById('comboName').disabled = true;
    document.getElementById('descripcion').disabled = true;
    document.getElementById('precio').disabled = true;
    document.getElementById('imgInput').disabled = true;

    document.getElementById('addRowBtn').disabled = true;
    document.getElementById('submitBtn').disabled = true;
}

function areAllRowsSaved() {
    const rows = document.querySelectorAll('#dataEdit tr');
    return [...rows].every(row => row.querySelector('.save-btn').classList.contains('d-none'));
}

window.handleNombreChange = (selectElement) => {
    const selectedOption = selectElement.selectedOptions[0];
    if (!selectedOption) return;

    const tipo = selectedOption.getAttribute('data-tipo');
    const categoria = selectedOption.getAttribute('data-categoria');
    const descripcion = selectedOption.getAttribute('data-descripcion');

    const row = selectElement.closest('tr');
    if (row) {
        row.querySelector('.tipo-cell').textContent = tipo || '';
        row.querySelector('.categoria-cell').textContent = categoria || '';
        row.querySelector('.descripcion-cell').textContent = descripcion || '';
    }
};

async function addRow(tipo, categoria, nombre, cantidad, editable = false) {
    const tableBody = document.getElementById('dataEdit');
    const row = document.createElement('tr');

    // Obtén los artículos
    const articulos = await fetchArticulos();

    // Genera las opciones para el select solo si la fila es editable
    const selectOptions = editable ? generateSelectOptions(articulos, nombre) : '';

    row.innerHTML = `
        <td class="tipo-cell">${tipo}</td>
        <td class="categoria-cell">${categoria}</td>
        <td class="nombre-cell">
            ${editable ? createNombreCell(selectOptions) : `<span class="nombre-text">${nombre}</span>`}
        </td>
        <td class="cantidad-cell">
            ${editable ? createCantidadCell(cantidad) : `<span class="cantidad-text">${cantidad}</span>`}
        </td>
        <td>
            ${editable ?
                `<button class="btn btn-sm save-btn" style="background-color: var(--primary-color); color: #fff;">Guardar</button>` :
                `<button class="btn btn-warning btn-sm edit-btn d-none">Editar</button>`
            }
                <button class="btn btn-warning btn-sm edit-btn ${editable ? 'd-none' : ''}">Editar</button>
                <button class="btn btn-danger btn-sm delete-btn">Eliminar</button>
            </td>
    `;

    // Insertar la fila al inicio del tableBody
    tableBody.insertBefore(row, tableBody.firstChild);

    addRowEventListeners(row);
}

function generateSelectOptions(articulos, selectedNombre) {
    return articulos.map(articulo =>
        `<option value="${articulo.nombre_articulo}" data-tipo="${articulo.tipo_producto.tipo_producto}" data-categoria="${articulo.categoria_producto.categoria}" data-descripcion="${articulo.descripcion_articulo}" ${selectedNombre === articulo.nombre_articulo ? 'selected' : ''}>${articulo.nombre_articulo}</option>`
    ).join('');
}

function createNombreCell(selectOptions) {
    return `<select class="form-control nombre-select" onchange="handleNombreChange(this)">${selectOptions}</select>`;
}

function createCantidadCell(cantidad) {
    return `<input type="number" class="form-control cantidad-input" value="${cantidad || 1}" min="1"/>`;
}

function initializeSelectValue(row, nombre) {
    const selectElement = row.querySelector('.nombre-select');
    selectElement.value = nombre;
    handleNombreChange(selectElement);
}

function addRowEventListeners(row) {
    // Agrega eventos a los botones de la fila
    const saveBtn = row.querySelector('.save-btn');
    const editBtn = row.querySelector('.edit-btn');
    const deleteBtn = row.querySelector('.delete-btn');

    saveBtn.addEventListener('click', () => {
        saveRow(row)
    });

    editBtn.addEventListener('click', () => {
        editRow(row)
    });

    deleteBtn.addEventListener('click', () => {
        row.remove();
    });
}

function saveRow(row) {
    const tipoCell = row.querySelector('.tipo-cell').textContent.trim();
    const nombreSelect = row.querySelector('.nombre-select').value;
    const cantidadInput = row.querySelector('.cantidad-input').value;

    if (tipoCell === '') {
        mostrarError('Datos incompletos', 'Por favor, complete los datos correctamente.');
        return;
    }

    row.querySelector('.nombre-cell').innerHTML = `<span class="nombre-text">${nombreSelect}</span>`;
    row.querySelector('.cantidad-cell').innerHTML = `<span class="cantidad-text">${cantidadInput}</span>`;

    row.querySelector('.save-btn').classList.add('d-none');
    row.querySelector('.edit-btn').classList.remove('d-none');

    disableEditingInOtherRows(row);
}

async function editRow(row) {
    const nombreCell = row.querySelector('.nombre-cell');
    const cantidadCell = row.querySelector('.cantidad-cell');

    if (nombreCell.querySelector('select')) {
        const selectedValue = nombreCell.querySelector('select').value;
        nombreCell.innerHTML = `<span class="nombre-text">${selectedValue}</span>`;
    } else {
        const articulos = await fetchArticulos();
        const nombreText = nombreCell.querySelector('.nombre-text') ? nombreCell.querySelector('.nombre-text').textContent : '';

        const selectOptions = generateSelectOptions(articulos, nombreText);
        const selectElement = document.createElement('select');
        selectElement.className = 'form-control nombre-select';
        selectElement.innerHTML = selectOptions;
        selectElement.onchange = () => handleNombreChange(selectElement);

        nombreCell.innerHTML = '';
        nombreCell.appendChild(selectElement);
        selectElement.value = nombreText;
    }

    if (cantidadCell.querySelector('input')) {
        const inputValue = cantidadCell.querySelector('input').value;
        cantidadCell.innerHTML = `<span class="cantidad-text">${inputValue}</span>`;
    } else {
        const cantidadText = cantidadCell.querySelector('.cantidad-text') ? cantidadCell.querySelector('.cantidad-text').textContent : '1';
        cantidadCell.innerHTML = `<input type="number" class="form-control cantidad-input" value="${cantidadText}" min="1"/>`;
    }

    row.querySelector('.edit-btn').classList.add('d-none');
    row.querySelector('.save-btn').classList.remove('d-none');

    disableEditingInOtherRows(row);
}

function disableEditingInOtherRows(currentRow) {
    const rows = document.querySelectorAll('#dataEdit tr');
    rows.forEach(row => {
        if (row !== currentRow) {
            const saveBtn = row.querySelector('.save-btn');
            const editBtn = row.querySelector('.edit-btn');

            if (!saveBtn.classList.contains('d-none')) {
                row.querySelector('.nombre-cell').innerHTML = `<span class="nombre-text">${row.querySelector('.nombre-select').value}</span>`;
                row.querySelector('.cantidad-cell').innerHTML = `<span class="cantidad-text">${row.querySelector('.cantidad-input').value}</span>`;

                saveBtn.classList.add('d-none');
                editBtn.classList.remove('d-none');
            }
        }
    });
}

document.getElementById('submitBtn').addEventListener('click', saveCombo);

document.getElementById('imgInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
        const base64String = reader.result.replace(/^data:.+;base64,/, '');

        document.getElementById('imgPreview').src = `data:image/png;base64,${base64String}`;
    };

    reader.readAsDataURL(file);
});
