// Datos de los trabajos
const trabajos = [
    {
        titulo: "Gestión Completa de Veterinaria Multimodular",
        tipo: "Programación Full Stack",
        descripcion: "Sistema completo de gestión veterinaria con backend en SQL Server y tres módulos: aplicación web con React, aplicación de escritorio en C# con .NET y aplicación móvil en Android Studio con Kotlin.",
        icono: "fas fa-paw"
    },
    {
        titulo: "Sistema de Gestión de Farmacia",
        tipo: "Programación / Desktop",
        descripcion: "Aplicación de escritorio con backend en SQL Server para administración y gestión completa de una farmacia. Incluye gestión de personal, clientes, proveedores, productos y sistema de facturación.",
        icono: "fas fa-prescription-bottle-alt"
    },
    {
        titulo: "Calculadora de Física - Cinemática",
        tipo: "Programación / C#",
        descripcion: "Aplicación desarrollada en C# con Windows Forms que resuelve todos los temas de cinemática de física, con interfaz intuitiva y resultados detallados.",
        icono: "fas fa-calculator"
    },
    {
        titulo: "Calculadora Física Gráfica",
        tipo: "Programación / Python",
        descripcion: "Módulo complementario a la calculadora de física desarrollado en Python que proporciona visualizaciones gráficas de los problemas de cinemática.",
        icono: "fas fa-chart-line"
    },
    {
        titulo: "Diseño de Logos y Edición de Imágenes",
        tipo: "Diseño Gráfico",
        descripcion: "Creación de logotipos y edición profesional de imágenes y fotografías utilizando herramientas de Adobe como Photoshop e Illustrator.",
        icono: "fas fa-paint-brush"
    },
    {
        titulo: "Animación El Mundo de Gumball",
        tipo: "Diseño / Animación",
        descripcion: "Animación temática basada en la serie 'El Mundo de Gumball' realizada con Adobe Illustrator, integrando diseño de personajes y escenarios.",
        icono: "fas fa-film"
    },
    {
        titulo: "Escenario de Feria en Blender",
        tipo: "Modelado 3D",
        descripcion: "Creación de assets y escenario completo de una feria de pueblo en Blender, incluyendo personajes animados y elementos interactivos.",
        icono: "fas fa-cube"
    },
    {
        titulo: "Animación Wall-E",
        tipo: "Animación 3D",
        descripcion: "Animación completa en Blender con temática de Wall-E de tres minutos de duración, incluyendo modelado de personajes, escenarios y efectos especiales.",
        icono: "fas fa-robot"
    }
];

// Función para generar las tarjetas de trabajos
function generarTarjetasTrabajos() {
    const container = document.getElementById('trabajos-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    trabajos.forEach(trabajo => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-content">
                <div class="card-icon"><i class="${trabajo.icono}"></i></div>
                <h3 class="card-title">${trabajo.titulo}</h3>
                <div class="card-type">${trabajo.tipo}</div>
                <p class="card-description">${trabajo.descripcion}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Función para configurar el formulario de contacto
function configurarFormularioContacto() {
    const form = document.getElementById('contact-form');
    const success = document.getElementById('contact-success');
    
    if (!form || !success) return;
    
    form.onsubmit = function(e) {
        e.preventDefault();
        success.innerHTML = `
            <div style="background:rgba(194, 240, 186, 0.3); padding:15px; border-radius:10px; border-left:4px solid var(--green-dark);">
                <p style="margin:0;"><i class="fas fa-check-circle"></i> ¡Gracias por tu mensaje! Te responderé a la brevedad posible.</p>
            </div>
        `;
        success.style.display = "block";
        form.reset();
        
        setTimeout(() => {
            success.scrollIntoView({behavior: "smooth", block: "center"});
        }, 100);
    };
}

// Inicialización cuando el DOM se carga
document.addEventListener('DOMContentLoaded', () => {
    const rutaActual = window.location.pathname;
    const nombreArchivo = rutaActual.split('/').pop();
    
    if (nombreArchivo === 'trabajos.html') {
        generarTarjetasTrabajos();
    } else if (nombreArchivo === 'contacto.html') {
        configurarFormularioContacto();
    }

    const enlaces = document.querySelectorAll('.nav-links a');
    enlaces.forEach(enlace => {
        const href = enlace.getAttribute('href');
        if (nombreArchivo === href || 
            (nombreArchivo === '' && href === 'home.html') || 
            (nombreArchivo === 'index.html' && href === 'home.html')) {
            enlace.classList.add('active');
        } else {
            enlace.classList.remove('active');
        }
    });
});
