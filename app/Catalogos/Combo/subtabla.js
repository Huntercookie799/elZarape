function generarTabla(datosJson) {
    const contenedorDatos = document.getElementById('data');
    if (!contenedorDatos) {
        console.error('No se encontró el contenedor "data"');
        return;
    }
    contenedorDatos.innerHTML = '';

    datosJson.forEach(combo => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>
                <img src="${combo.foto ? `${combo.foto}` : 'img/combo.png'}" alt="Imagen del combo" style="max-width: 200px; max-height: 200px;"/>
            </td>
            <td>${combo.combo_nombre}</td>
            <td>${combo.combo_descripcion}</td>
            <td>$${combo.combo_precio.toFixed(2)}</td>
            <td>
                <button class="btn" style="background-color: var(--primary-color); color: #fff;" onclick="alternarSubTabla(this)">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="btn" style="background-color: var(--primary-color-light); color: var(--text-color);" data-bs-toggle="modal" data-bs-target="#userForm" onclick="viewCombo('${combo.combo_id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn" style="background-color: var(--sidebar-color); color: #fff;" data-bs-toggle="modal" data-bs-target="#userForm" onclick="editCombo('${combo.combo_id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn" style="background-color: var(--toggle-color); color: #fff;" onclick="deleteCombo('${combo.combo_id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        contenedorDatos.appendChild(fila);

        const filaSubTabla = document.createElement('tr');
        filaSubTabla.className = 'sub-table';
        filaSubTabla.style.display = 'none';
        filaSubTabla.innerHTML = `
            <td colspan="5">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Clase alimento</th>
                            <th>Artículo</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${combo.combo_articulos.map(alimnento => `
                            <tr>
                                <td>${alimnento.tipo_producto.tipo_producto}</td>
                                <td>${alimnento.nombre_articulo}</td>
                                <td>${alimnento.cantidad_producto}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </td>
        `;
        contenedorDatos.appendChild(filaSubTabla);
    });
}

function alternarSubTabla(boton) {
    const filaSubTabla = boton.closest('tr').nextElementSibling;
    if (filaSubTabla && filaSubTabla.classList.contains('sub-table')) {
        const icono = boton.querySelector('i');
        if (filaSubTabla.style.display === 'none') {
            filaSubTabla.style.display = 'table-row';
        } else {
            filaSubTabla.style.display = 'none';
        }
    }
}

async function cargarDatos() {
    let datosJson = JSON.parse(localStorage.getItem('combos')) || [];

    if (datosJson.length === 0) {
        try {
            const response = await fetch('datos.json');
            datosJson = await response.json();

            localStorage.setItem('combos', JSON.stringify(datosJson));
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            return;
        }
    }

    console.log(datosJson);
    generarTabla(datosJson);
}

function deleteCombo(comboNombre) {
    let combos = JSON.parse(localStorage.getItem('combos')) || [];

    // Si solo hay un combo, cambia su nombre a '1'
    if (combos.length === 1) {
        combos[0]= '1'; // Cambia el nombre del único combo a '1'
    } else {
        // Si hay más de un combo, filtra y elimina el combo específico
        combos = combos.filter(combo => combo.combo_nombre !== comboNombre);
    }

    // Guarda los cambios en el localStorage
    localStorage.setItem('combos', JSON.stringify(combos));

    // Vuelve a cargar los datos
    cargarDatos();
}
