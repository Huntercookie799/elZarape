document.addEventListener('DOMContentLoaded', () => {

    const productos = {
        platillos: [
            { id: 1, nombre: 'Taco al Pastor', precio: 21.00, descripcion: 'Taco de Pastor', imagen: 'imgP/TacoP.jfif', categoria: 'Plato Fuerte' },
            { id: 2, nombre: 'Taco de Carne Asada', precio: 30.00, descripcion: 'Taco de Carne Asada', imagen: 'imgP/TacoCA.jfif', categoria: 'Plato Fuerte' },
            { id: 3, nombre: 'Quesadilla', precio: 25.00, descripcion: 'Quesadilla de Queso', imagen: 'imgP/keka.jfif', categoria: 'Sencillos' },
            { id: 4, nombre: 'Enchiladas', precio: 50.00, descripcion: 'Enchilada de Pollo', imagen: 'imgP/Ench.jfif', categoria: 'Plato Fuerte' },
            { id: 5, nombre: 'Guacamole', precio: 70.00, descripcion: 'Guacamole con Totopos', imagen: 'imgP/Guaca.jfif', categoria: 'Salsas' },
            { id: 6, nombre: 'Tamal', precio: 15.00, descripcion: 'Tamal de Elote', imagen: 'imgP/tamal.jfif', categoria: 'Sencillos' }
        ],
        bebidas: [
            { id: 7, nombre: 'Coca Cola', precio: 18.00, descripcion: 'Refresco de Cola', imagen: 'imgP/Cocacola.webp', categoria: 'Bebidas' },
            { id: 8, nombre: 'Agua de Horchata', precio: 15.00, descripcion: 'Bebida de Arroz', imagen: 'imgP/aguaH.webp', categoria: 'Bebidas' },
            { id: 9, nombre: 'Café', precio: 20.00, descripcion: 'Bebida Caliente de Café', imagen: 'imgP/cafe.jpg', categoria: 'Bebidas' },
            { id: 10, nombre: 'Jugo de Naranja', precio: 25.00, descripcion: 'Jugo Natural de Naranja', imagen: 'imgP/jugo.webp', categoria: 'Bebidas' }
        ],
        combos: [
            { id: 11, nombre: 'Combo a la Mexicana', precio: 80.00, descripcion: 'Dos tacos al pastor, dos tacos de carne asada', imagen: 'imgP/Tp.jfif', incluye: [1, 2], categoria: 'Combos' },
            { id: 12, nombre: 'Combo Tradicional Mexicano', precio: 100.00, descripcion: 'Tacos al pastor acompañados de arroz rojo, frijoles refritos y una ensalada de nopales con aguacate. Incluye una bebida de horchata fresca.', imagen: 'imgP/tp2.jfif', incluye: [1, 8], categoria: 'Combos' },
            { id: 13, nombre: 'Combo Tex-Mex Picante', precio: 150.00, descripcion: 'Burrito grande de carne asada con guacamole y pico de gallo, servido con nachos gratinados con queso cheddar y jalapeños. Acompañado de una bebida de margarita frozen.', imagen: 'imgP/B.jfif', incluye: [2, 5], categoria: 'Combos' },
            { id: 14, nombre: 'Combo Vegetariano Mexicano', precio: 180.00, descripcion: 'Tostadas de tinga de setas con crema, acompañadas de elote asado con cotija y chile en polvo. Incluye una ensalada fresca de aguacate y tomate. Para beber, agua de jamaica natural.', imagen: 'imgP/cham.png', incluye: [], categoria: 'Combos' },
            { id: 15, nombre: 'Combo Mariscos Mexicano', precio: 200.00, descripcion: 'Tacos de pescado estilo Baja con salsa de chipotle, acompañados de arroz a la mexicana y una porción de ceviche de camarón fresco. Incluye una cerveza mexicana bien fría.', imagen: 'imgP/mar.jfif', incluye: [], categoria: 'Combos' },
            { id: 16, nombre: 'Combo Desayuno Mexicano', precio: 100.00, descripcion: 'Huevos rancheros con salsa verde y tortillas de maíz calientes, servidos con frijoles charros y plátanos machos fritos. Para beber, café de olla con canela y piloncillo.', imagen: 'imgP/desa.png', incluye: [9], categoria: 'Combos' }
        ]
    };
    
    
    
    
    const btnPagar = document.getElementById('btnPagar');
    btnPagar.addEventListener('click', () => {
        // Almacenar el carrito en el almacenamiento local
        localStorage.setItem('carritoCompras', JSON.stringify(carritoCompras));
        localStorage.setItem('totalCarrito', totalCarrito.textContent);
        // Redirigir a pagar.html
        window.location.href = 'pagar.html';
    });

    // Ejemplo de cómo manejar la selección de sucursal
    const sucursalSelect = document.getElementById('sucursalSelect');
    sucursalSelect.addEventListener('change', (event) => {
        const sucursal = event.target.value;
        console.log(`Sucursal seleccionada: ${sucursal}`);
        // Aquí puedes agregar el código necesario para manejar la selección de la sucursal
    });

    // Funcionalidad para mostrar/ocultar el carrito de compras
    const carrito = document.getElementById('carrito');
    const btnToggleCarrito = document.getElementById('btnToggleCarrito');
    
    // Mostrar carrito y establecer texto del botón al cargar la página
    carrito.style.display = 'block';
    btnToggleCarrito.textContent = 'Ocultar Carrito';

    btnToggleCarrito.addEventListener('click', () => {
        if (carrito.style.display === 'none') {
            carrito.style.display = 'block';
            btnToggleCarrito.textContent = 'Ocultar Carrito';
        } else {
            carrito.style.display = 'none';
            btnToggleCarrito.textContent = 'Ver Carrito';
        }
    });





    const btnPlatillos = document.getElementById('btnPlatillos');
    const btnBebidas = document.getElementById('btnBebidas');
    const btnCombos = document.getElementById('btnCombos');
    const categorias = document.getElementById('categorias');
    const listaCarrito = document.getElementById('listaCarrito');
    const totalCarrito = document.getElementById('totalCarrito');

    let carritoCompras = [];

    const mostrarProductos = (categoria) => {
        categorias.innerHTML = '';
        productos[categoria].forEach(producto => {
            const divProducto = document.createElement('div');
            divProducto.className = 'product col-12 col-sm-6 col-lg-3';
    
            // Etiqueta de categoría sobre la imagen
            const categoriaLabel = document.createElement('div');
            categoriaLabel.className = 'categoria-label';
            categoriaLabel.textContent = producto.categoria;
            divProducto.appendChild(categoriaLabel);
    
            divProducto.innerHTML += `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="decrease action-button" onclick="selectProduct(${producto.id})">-</button>
                    <span class="quantity">1</span>
                    <button class="increase action-button">+</button>
                </div>
                <button class="action-button" onclick="verDetalles(${producto.id}, '${categoria}')">Ver Detalles</button>
                <button class="action-button" onclick="agregarAlCarrito(${producto.id}, '${categoria}')">Agregar al Carrito</button>
            `;
    
            divProducto.addEventListener('click', function(event) {
                if (!event.target.classList.contains('action-button')) {
                    divProducto.classList.toggle('selected');
    
                    if (divProducto.classList.contains('selected')) {
                        agregarAlCarrito(producto.id, categoria);
                    } else {
                        removerDelCarrito(producto.id);
                    }
                }
            });
    
            divProducto.querySelector('.quantity-controls').addEventListener('click', function(event) {
                if (event.target.classList.contains('decrease')) {
                    changeQuantity(event, event.target, -1, producto.id);
                } else if (event.target.classList.contains('increase')) {
                    changeQuantity(event, event.target, 1, producto.id);
                }
            });
    
            categorias.appendChild(divProducto);
        });
    };

    
    window.verDetalles = (id, categoria) => {
        const producto = productos[categoria].find(p => p.id === id);
    
        // Inicializar la variable comboItems como vacía
        let comboItems = '';
    
        // Verificar si el producto es un combo
        if (categoria === 'combos') {
            const combo = productos.combos.find(c => c.id === id);
            // Mapear los productos incluidos en el combo
            comboItems = combo.incluye.map(itemId => {
                const item = productos.platillos.concat(productos.bebidas).find(p => p.id === itemId);
                return `
                    <tr>
                        <td><img src="${item.imagen}" style="max-width: 100px; height: auto; cursor: pointer;" onclick="verDetalles(${item.id}, '${item.categoria}');" alt="${item.nombre}"></td>
                        <td>${item.nombre}</td>
                        <td>1</td> <!-- Puedes ajustar aquí la cantidad, dependiendo de cómo la manejes -->
                    </tr>
                `;
            }).join('');
        }
    
        // Construir el contenido de SweetAlert
        Swal.fire({
            title: producto.nombre,
            html: `
                <img src="${producto.imagen}" style="max-width: 100%; height: 200px;" alt="${producto.nombre}">
                <p>${producto.descripcion}</p>
                <p>Precio: $${producto.precio.toFixed(2)}</p>
                ${categoria === 'combos' ? `
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Foto</th>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${comboItems}
                        </tbody>
                    </table>
                ` : ''}
                <div class="d-flex justify-content-center">
                    <div class="quantity-controls">
                        <button class="decrease action-button" onclick="changeQuantity(${producto.id}, -1)">-</button>
                        <span id="cantidad-${producto.id}" class="quantity">1</span>
                        <button class="increase action-button" onclick="changeQuantity(${producto.id}, 1)">+</button>
                    </div>
                    <button class="btn btn-success ml-2" onclick="agregarAlCarrito(${producto.id}, '${categoria}')">Agregar al Carrito</button>
                    <button class="btn btn-secondary ml-2" onclick="Swal.close()">Cerrar</button>
                </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false
        });
    };
        

    window.agregarAlCarrito = (id, categoria) => {
        const producto = productos[categoria].find(p => p.id === id);
        const productoEnCarrito = carritoCompras.find(item => item.id === producto.id);

        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            carritoCompras.push({ ...producto, cantidad: 1, categoria });
        }

        actualizarCarrito();
    };

    window.removerDelCarrito = (id) => {
        const index = carritoCompras.findIndex(item => item.id === id);
        if (index !== -1) {
            if (carritoCompras[index].cantidad > 1) {
                carritoCompras[index].cantidad--;
            } else {
                carritoCompras.splice(index, 1);
            }
        }
        actualizarCarrito();
    };

    const actualizarCarrito = () => {
        listaCarrito.innerHTML = '';
        let total = 0;
    
        carritoCompras.forEach(producto => {
            total += producto.precio * producto.cantidad;
            const li = document.createElement('li');
            
            // Crear contenedor para el contenido del carrito
            const divContenido = document.createElement('div');
            divContenido.classList.add('d-flex', 'align-items-center');
    
            // Imagen del producto en el carrito
            const imgProducto = document.createElement('img');
            imgProducto.src = producto.imagen;
            imgProducto.alt = producto.nombre;
            imgProducto.style.maxWidth = '50px'; // Ajusta el tamaño de la imagen según necesites
            imgProducto.classList.add('mr-3');
            divContenido.appendChild(imgProducto);
    
            // Información y botones del producto
            const divInfo = document.createElement('div');
            divInfo.innerHTML = `
                <div>
                    <strong>${producto.nombre}</strong> - $${producto.precio.toFixed(2)} x <span id="cantidad-${producto.id}">${producto.cantidad}</span>
                </div>
                <div class="btn-group" role="group">
                    <button class="btn btn-danger btn-sm" onmousedown="removerDelCarrito(${producto.id})" onmouseup="stopChanging(${producto.id})" onmouseleave="stopChanging(${producto.id})">-</button>
                    <button class="btn btn-success btn-sm" onmousedown="agregarAlCarrito(${producto.id}, '${producto.categoria}')" onmouseup="stopChanging(${producto.id})" onmouseleave="stopChanging(${producto.id})">+</button>
                </div>
            `;
            divContenido.appendChild(divInfo);
    
            // Evento doble clic para ver detalles del producto
            divContenido.addEventListener('dblclick', () => {
                verDetalles(producto.id, producto.categoria);
            });
    
            li.appendChild(divContenido);
            listaCarrito.appendChild(li);
        });
    
        totalCarrito.textContent = total.toFixed(2);
    
        if (carritoCompras.length > 0) {
            carrito.classList.add('visible');
        } else {
            carrito.classList.remove('visible');
        }
    };
    
    let intervalo = null;
    
    // Función para incrementar o decrementar la cantidad mientras se mantiene presionado el botón
    function changeQuantity(id, cantidad) {
        const producto = carritoCompras.find(item => item.id === id);
        if (producto) {
            producto.cantidad += cantidad;
            document.getElementById(`cantidad-${id}`).textContent = producto.cantidad;
            actualizarCarrito(); // Actualizar el carrito después de cambiar la cantidad
        }
    }
    
    // Detener el incremento o decremento al soltar el botón o al salir del área del botón
    function stopChanging(id) {
        clearInterval(intervalo);
    }
    
    // Agregar evento de doble clic para ver detalles del producto
    listaCarrito.addEventListener('dblclick', event => {
        const target = event.target;
        if (target && target.tagName === 'LI') {
            const id = parseInt(target.dataset.id);
            const categoria = target.dataset.categoria;
            if (!isNaN(id) && categoria) {
                verDetalles(id, categoria);
            }
        }
    });

    btnPlatillos.addEventListener('click', () => mostrarProductos('platillos'));
    btnBebidas.addEventListener('click', () => mostrarProductos('bebidas'));
    btnCombos.addEventListener('click', () => mostrarProductos('combos'));

    // Mostrar inicialmente los platillos
    mostrarProductos('platillos');
});
