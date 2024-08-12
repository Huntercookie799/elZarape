const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

// Set initial states from cookies
if (getCookie('sidebar') === 'close') {
    sidebar.classList.add("close");
}
if (getCookie('mode') === 'dark') {
    body.classList.add("dark");
    modeText.innerText = "Tema claro";
} else {
    modeText.innerText = "Tema oscuro";
}

// Toggle sidebar state and save in cookie
toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    setCookie('sidebar', sidebar.classList.contains('close') ? 'close' : 'open', 7);
});

// Ensure sidebar opens on search
searchBtn.addEventListener("click", () => {
    sidebar.classList.remove("close");
    setCookie('sidebar', 'open', 7);
});

// Toggle dark mode and save in cookie
modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");
    setCookie('mode', body.classList.contains('dark') ? 'dark' : 'light', 7);

    if(body.classList.contains("dark")) {
        modeText.innerText = "Tema claro";
    } else {
        modeText.innerText = "Tema oscuro";
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            // Cerrar todos los elementos del acordeón que no sean el actualmente seleccionado
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    otherContent.style.maxHeight = '0';
                }
            });

            // Abrir o cerrar el elemento actual del acordeón
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });
});

/*
    Control de Cookies
*/

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
