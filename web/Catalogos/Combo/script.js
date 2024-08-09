document.addEventListener("DOMContentLoaded", function() {
    fetch('table.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('main-content').innerHTML = data;

            const TablaScript = document.createElement('script');
            TablaScript.src = 'subtabla.js';
            document.body.appendChild(TablaScript);
            
            console.log(TablaScript);

            TablaScript.onload = function() {
                cargarDatos();
            };
        });

    fetch('modal.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('modals').innerHTML = data;

            const ModalScript = document.createElement('script');
            ModalScript.src = 'modal.js';
            document.body.appendChild(ModalScript);
            
            ModalScript.onload = function() {
                startTablaModal();
            };
        });
});
