let originalContent = ''; // Definir como variable global

document.addEventListener("DOMContentLoaded", function() {
    const homeSection = document.querySelector('.home');
    originalContent = homeSection.innerHTML;

    // Obtener la última página cargada desde localStorage
    const lastPage = localStorage.getItem('lastPage') || '';
    loadExternalContent(lastPage, originalContent);
});

function loadExternalContent(page = '', originalContent = '') {
    const homeSection = document.querySelector('.home');
    
    if (!page.trim() || page === 'inicio') {
        homeSection.innerHTML = originalContent;
        // Eliminar la última página del localStorage si es "inicio"
        localStorage.removeItem('lastPage');
        return;
    }
    
    homeSection.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = `Catalogos/${page}/`; // Ruta relativa a la raíz del proyecto
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    homeSection.appendChild(iframe);

    // Guardar la página actual en localStorage
    localStorage.setItem('lastPage', page);

    iframe.onload = function() {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        const images = iframeDocument.querySelectorAll('img');
        images.forEach(img => {
            if (!img.src.startsWith('http') && !img.src.startsWith('/')) {
                img.src = `Catalogos/${page}/${img.getAttribute('src')}`;
            }
        });
    };

    iframe.onerror = function() {
        alert('Error loading external content from ' + iframe.src);
    };
}
