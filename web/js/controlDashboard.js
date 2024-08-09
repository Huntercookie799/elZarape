let originalContent = ''; // Definir como variable global

document.addEventListener("DOMContentLoaded", function() {
    const homeSection = document.querySelector('.home');
    originalContent = homeSection.innerHTML;
    loadExternalContent('', originalContent);
});

function loadExternalContent(page = '', originalContent = '') {
    const homeSection = document.querySelector('.home');
    
    if (!page.trim()) {
        homeSection.innerHTML = originalContent;
        return;
    }
    
    homeSection.innerHTML = '';
    const iframe = document.createElement('iframe');
    // Intenta una de las siguientes opciones de ruta
    iframe.src = `Catalogos/${page}/`; // Ruta relativa a la raíz del proyecto
    // iframe.src = `./Catalogos/${page}/`; // Ruta relativa a la ubicación actual
    // iframe.src = `${window.location.origin}/Catalogos/${page}/`; // Ruta absoluta basada en el dominio

    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    homeSection.appendChild(iframe);

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
        alert('Error loading external content from', iframe.src);
    };
}
