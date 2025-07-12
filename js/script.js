// Lógica JavaScript
// --- Obtención de elementos del DOM ---
const queryTypeSelect = document.getElementById('queryType');
const dateRangeInputsDiv = document.getElementById('dateRangeInputs');
const monthYearInputsDiv = document.getElementById('monthYearInputs');
const fechaInicioInput = document.getElementById('fechaInicio');
const fechaFinInput = document.getElementById('fechaFin');
const yearInput = document.getElementById('year');
const monthSelect = document.getElementById('month');
const consultarBtn = document.getElementById('consultarBtn');
const limpiarBtn = document.getElementById('limpiarBtn');
const resultsBody = document.getElementById('resultsBody');
const statusDiv = document.getElementById('status');
const themeToggleBtn = document.getElementById('themeToggleBtn'); // Botón de tema
const bodyElement = document.body; // Referencia al body
const exportBtn = document.getElementById('exportBtn'); // Botón de exportar
const resultsTable = document.getElementById('resultsTable'); // Tabla de resultados

// Referencias del modal
const confirmModal = document.getElementById('confirmModal');
const modalConfirmBtn = document.getElementById('modal-confirm');
const modalCancelBtn = document.getElementById('modal-cancel');
const modalMessage = document.getElementById('modal-message');
const modalTitle = document.getElementById('modal-title');

// --- CONFIGURACIÓN DE LA API ---
// La configuración se carga desde config.js (archivo separado por seguridad)
// IMPORTANTE: config.js está en .gitignore y NO se sube a GitHub
const API_TOKEN = window.API_CONFIG?.API_TOKEN || "TU_API_TOKEN_AQUI";
const BASE_API_URL = window.API_CONFIG?.BASE_API_URL || "https://api.json-pe.com/sunat/tc";
// --------------------

// Función para mostrar mensajes de estado al usuario en el div 'status'.
// Permite especificar el tipo de mensaje (info, success, error) para aplicar estilos CSS.
function showStatus(message, type = 'info') { // types: info, success, error, loading
    statusDiv.textContent = message;
    statusDiv.className = type; // Asigna la clase para el estilo CSS

    // Add loading dots animation for loading state
    if (type === 'loading') {
        statusDiv.classList.add('loading-dots');
    } else {
        statusDiv.classList.remove('loading-dots');
    }
}

// Función para limpiar la tabla de resultados y el mensaje de estado.
// También deshabilita el botón de exportar.
function clearAll() {
    resultsBody.innerHTML = ''; // Limpia la tabla
    statusDiv.textContent = ''; // Limpia el mensaje de estado
    statusDiv.className = ''; // Quita clases de estilo al status
    exportBtn.disabled = true; // Deshabilitar botón al limpiar
}

// Función para formatear un objeto Date al formato 'YYYY-MM-DD', requerido por la API.
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses son 0-indexados
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Función para formatear una fecha en formato 'YYYY-MM-DD' a 'DD/MM/YYYY' para mostrarla en la tabla.
// Devuelve 'N/A' si la fecha no es válida o tiene un formato inesperado.
function formatDateForDisplay(dateString) {
    if (!dateString || typeof dateString !== 'string') return 'N/A';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString; // Devuelve original si no tiene el formato esperado
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
}

// Función que maneja la visibilidad de los campos de entrada según el tipo de consulta seleccionado.
function handleQueryTypeChange() {
    const selectedType = queryTypeSelect.value;
    dateRangeInputsDiv.style.display = 'none';
    monthYearInputsDiv.style.display = 'none';

    if (selectedType === 'range') {
        dateRangeInputsDiv.style.display = 'block';
    } else if (selectedType === 'month') {
        monthYearInputsDiv.style.display = 'block';
        // Establece el año y mes actuales por defecto si los campos están vacíos.
        const today = new Date();
        if (!yearInput.value) {
            yearInput.value = today.getFullYear();
        }
        if (monthSelect.selectedIndex === -1 || monthSelect.value === '') {
            monthSelect.value = today.getMonth() + 1;
        }
    }
    // No es necesario 'block' para 'day' ya que no tiene inputs específicos
    // Limpia los campos de fecha de rango para evitar confusiones al cambiar el tipo de consulta.
    // No se limpian año/mes para conveniencia si el usuario vuelve a 'month'.
    fechaInicioInput.value = '';
    fechaFinInput.value = '';
}

// --- Función principal para consultar la API de tipo de cambio ---
// Es una función asíncrona porque utiliza 'await' para la llamada fetch.
async function fetchExchangeRates() {
    clearAll(); // Limpia resultados anteriores
    showStatus('Consultando tipos de cambio', 'loading');

    if (!API_TOKEN || API_TOKEN === "TU_API_TOKEN_AQUI") {
        showStatus("Error: Falta configurar el API_TOKEN en config.js", 'error');
        return;
    }

    const queryType = queryTypeSelect.value;
    let fechaInicioStr = '';
    let fechaFinStr = '';
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Poner a medianoche para comparar solo fechas

    try {
        // Determina las fechas de inicio y fin según el tipo de consulta
        if (queryType === 'day') {
            fechaInicioStr = formatDate(today);
            fechaFinStr = fechaInicioStr;
        } else if (queryType === 'range') {
            if (!fechaInicioInput.value || !fechaFinInput.value) {
                showStatus('Error: Por favor, seleccione fecha de inicio y fin.', 'error');
                return;
            }
            const fechaInicio = new Date(fechaInicioInput.value + 'T00:00:00'); // Asegurar zona horaria local
            const fechaFin = new Date(fechaFinInput.value + 'T00:00:00');

            if (isNaN(fechaInicio) || isNaN(fechaFin)) {
                showStatus('Error: Fechas inválidas.', 'error');
                return;
            }
            if (fechaInicio > today || fechaFin > today) {
                showStatus('Error: Las fechas no pueden ser futuras.', 'error');
                return;
            }
            if (fechaInicio > fechaFin) {
                showStatus('Error: La fecha de inicio no puede ser mayor que la fecha de fin.', 'error');
                return;
            }

            fechaInicioStr = formatDate(fechaInicio);
            fechaFinStr = formatDate(fechaFin);
        } else if (queryType === 'month') {
            const year = parseInt(yearInput.value, 10);
            const month = parseInt(monthSelect.value, 10);

            if (!year || !month || year < 1900 || month < 1 || month > 12) {
                showStatus('Error: Año o mes inválido.', 'error');
                return;
            }

            let fechaInicio = new Date(year, month - 1, 1); // Mes es 0-indexado
            let fechaFin = new Date(year, month, 0); // Día 0 del siguiente mes da el último del mes actual

            // Validar si el mes completo es futuro
            if (fechaInicio > today) {
                showStatus('No se puede consultar datos de un mes futuro.', 'info');
                return; // Salir sin error, solo informativo
            }

            // Si el mes es el actual o parcialmente futuro, ajustar fechaFin a hoy
            if (fechaFin > today) {
                fechaFin = today;
            }

            fechaInicioStr = formatDate(fechaInicio);
            fechaFinStr = formatDate(fechaFin);
        }

        // Construye la URL de la API con los parámetros necesarios.
        const apiUrl = `${BASE_API_URL}?fechaInicio=${fechaInicioStr}&fechaFin=${fechaFinStr}&apikey=${API_TOKEN}`;

        // Realiza la petición a la API usando fetch.
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded', // Generalmente no necesaria para GET
                'apikey': API_TOKEN // Cabecera correcta para la API key
            }
        });

        // Verifica si la respuesta HTTP indica éxito (status 200-299).
        if (!response.ok) {
            // Intenta obtener más detalles del error del cuerpo de la respuesta.
            let errorBody = '';
            try {
                errorBody = await response.text(); // O response.json() si la API devuelve errores JSON
            } catch (e) {
                // Ignorar si no se puede leer el cuerpo
            }
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}. ${errorBody}`);
        }

        // Convierte el cuerpo de la respuesta a formato JSON.
        const data = await response.json();

        // Procesa la respuesta JSON. Verifica que la estructura sea la esperada.
        if (data && data.body && data.body.items && Array.isArray(data.body.items)) {
            if (data.body.items.length > 0) {
                // Llenar la tabla
                data.body.items.forEach(item => {
                    const row = resultsBody.insertRow();
                    // Formatear fecha antes de insertarla
                    row.insertCell(0).textContent = formatDateForDisplay(item.fechaSunat);
                    row.insertCell(1).textContent = item.compra || 'N/A';
                    row.insertCell(2).textContent = item.venta || 'N/A';
                    row.insertCell(3).textContent = item.moneda || 'N/A';
                    row.insertCell(4).textContent = "SUNAT"; // Origen fijo
                });
                showStatus(`La búsqueda se completó con ${data.body.items.length} resultado(s).`, 'success');
                exportBtn.disabled = false; // Habilitar botón si hay resultados
            } else {
                showStatus('No se encontraron datos para las fechas seleccionadas.', 'info');
                exportBtn.disabled = true; // Mantener/deshabilitar botón si no hay resultados
            }
        } else {
            // Si la estructura del JSON no es la esperada, muestra un error y lo registra en consola.
            console.error("Respuesta JSON inesperada:", data); // Log para depuración
            showStatus('Error: La respuesta de la API no tiene el formato esperado (body/items).', 'error');
            exportBtn.disabled = true; // Deshabilitar botón en caso de error
        }

    } catch (error) {
        // Captura cualquier error durante la petición fetch o el procesamiento JSON.
        console.error('Error en la consulta API:', error); // Log para depuración
        showStatus(`Error en la consulta: ${error.message}`, 'error');
        exportBtn.disabled = true; // Deshabilitar botón en caso de error
    }
}

// --- Función para exportar los datos de la tabla a un archivo Excel (.xlsx) ---
function exportTableToExcel() {
    // Verifica si la librería SheetJS (XLSX) está cargada globalmente.
    if (typeof XLSX === 'undefined') {
        showStatus('Error: La librería de exportación (XLSX) no está disponible.', 'error');
        console.error("XLSX library is not loaded.");
        return;
    }

    // Verifica si hay filas (resultados) en el cuerpo de la tabla.
    if (resultsBody.rows.length === 0) {
        showStatus('No hay datos en la tabla para exportar.', 'info');
        return;
    }

    try {
        showStatus('Generando archivo Excel...', 'info');

        // Convierte el elemento <table> completo (incluyendo cabecera) en un 'workbook' de SheetJS.
        // {raw: true} intenta preservar los valores como están en la tabla, útil para números.
        const wb = XLSX.utils.table_to_book(resultsTable, { sheet: "TipoCambio", raw: true });

        // Genera un nombre de archivo dinámico con la fecha actual.
        const fileName = `Tipo_Cambio_SUNAT_${formatDate(new Date())}.xlsx`;

        // Dispara la descarga del archivo .xlsx generado.
        XLSX.writeFile(wb, fileName);

        showStatus('Archivo Excel generado con éxito.', 'success');

    } catch (error) {
        // Captura errores durante la generación o descarga del archivo Excel.
        console.error('Error al exportar a Excel:', error);
        showStatus(`Error al exportar a Excel: ${error.message}`, 'error');
    }
}

// --- Lógica para el cambio de tema (Claro/Oscuro) ---
// Aplica la clase CSS 'light-mode' al body y actualiza el icono/título del botón.
function setTheme(theme) {
    if (theme === 'light') {
        bodyElement.classList.add('light-mode');
        themeToggleBtn.textContent = '☀️'; // Sol para modo claro
        themeToggleBtn.title = 'Cambiar a modo oscuro';
    } else {
        bodyElement.classList.remove('light-mode');
        themeToggleBtn.textContent = '🌓'; // Luna para modo oscuro
        themeToggleBtn.title = 'Cambiar a modo claro';
    }
    // Guarda la preferencia del tema en localStorage para persistencia entre visitas.
    localStorage.setItem('themePreference', theme); // Guardar preferencia
}

// Event listener para el botón de cambio de tema.
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = bodyElement.classList.contains('light-mode') ? 'light' : 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Al cargar el DOM, aplica el tema guardado o el tema oscuro por defecto.
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('themePreference') || 'dark'; // Oscuro por defecto si no hay preferencia guardada.
    setTheme(savedTheme);
});

// --- Funciones del Modal ---
// Función para mostrar el modal de confirmación
function showConfirmModal(title, message) {
    return new Promise((resolve) => {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        confirmModal.classList.add('show');

        // Función para cerrar el modal
        const closeModal = () => {
            confirmModal.classList.remove('show');
            modalConfirmBtn.removeEventListener('click', handleConfirm);
            modalCancelBtn.removeEventListener('click', handleCancel);
            // Eliminar event listener del overlay
            confirmModal.removeEventListener('click', handleOverlayClick);
        };

        // Manejar confirmación
        const handleConfirm = () => {
            closeModal();
            resolve(true);
        };

        // Manejar cancelación
        const handleCancel = () => {
            closeModal();
            resolve(false);
        };

        // Manejar clic en overlay para cerrar
        const handleOverlayClick = (e) => {
            if (e.target === confirmModal) {
                closeModal();
                resolve(false);
            }
        };

        // Añadir event listeners
        modalConfirmBtn.addEventListener('click', handleConfirm);
        modalCancelBtn.addEventListener('click', handleCancel);
        confirmModal.addEventListener('click', handleOverlayClick);

        // Manejar tecla Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                resolve(false);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    });
}

// --- Event Listeners ---
queryTypeSelect.addEventListener('change', handleQueryTypeChange);
consultarBtn.addEventListener('click', fetchExchangeRates);
limpiarBtn.addEventListener('click', async () => {
    const confirmed = await showConfirmModal('Confirmar acción', '¿Desea Limpiar la lista?');
    if (confirmed) {
        clearAll();
        showStatus('Resultados limpiados.', 'info');
    }
});
exportBtn.addEventListener('click', exportTableToExcel); // Añadir listener para exportar

// Inicializa la visibilidad de los inputs según la opción seleccionada por defecto al cargar la página.
handleQueryTypeChange();
// Establece la fecha de hoy por defecto en los campos de rango al cargar.
const todayStr = formatDate(new Date());
fechaInicioInput.value = todayStr;
fechaFinInput.value = todayStr;