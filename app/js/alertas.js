function mostrarError(titulo, descripcion) {
    Swal.fire({
        title: titulo,
        text: descripcion,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        customClass: {
            confirmButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });
}

function mostrarInformacion(titulo, descripcion) {
    Swal.fire({
        title: titulo,
        text: descripcion,
        icon: 'info',
        confirmButtonText: 'Aceptar',
        customClass: {
            confirmButton: 'btn btn-warning'
        },
        buttonsStyling: false
    });
}

function mostrarExito(titulo, descripcion) {
    Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: titulo,
        text: descripcion,
        showConfirmButton: false,
        timer: 1500, 
        customClass: {
            container: 'custom-container',
            title: 'custom-title',
            text: 'custom-text'
        },
        toast: true,
        buttonsStyling: false
    });
}


async function mostrarConfirmacion(titulo, descripcion) {
    const result = await Swal.fire({
        title: titulo,
        text: descripcion,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        customClass: {
            confirmButton: 'btn btn-warning',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });

    return result.isConfirmed;
}
