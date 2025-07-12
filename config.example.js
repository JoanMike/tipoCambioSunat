// Configuración de ejemplo - COPIA ESTE ARCHIVO COMO config.js
// Este archivo SÍ puede subirse a GitHub como plantilla

// --- CONFIGURACIÓN DE LA API ---
// API_TOKEN: Token de autenticación para acceder a la API.
// BASE_API_URL: URL base del endpoint de la API para consultar el tipo de cambio.
const API_CONFIG = {
    API_TOKEN: "TU_API_TOKEN_AQUI", // Reemplaza con tu token real
    BASE_API_URL: "https://api.json-pe.com/sunat/tc"
};

// Exportar la configuración para uso en script.js
if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
}
