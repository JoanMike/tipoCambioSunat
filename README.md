# Consulta Tipo de Cambio SUNAT

Una aplicación web moderna para consultar los tipos de cambio oficiales de SUNAT de manera rápida y sencilla.

## 🚀 Características

- ✅ Consulta de tipo de cambio del día actual
- ✅ Consulta por rango de fechas personalizado
- ✅ Consulta de mes completo
- ✅ Exportación a Excel (.xlsx)
- ✅ Interfaz moderna con tema claro/oscuro
- ✅ Diseño responsive
- ✅ Modal de confirmación para acciones

## 🔧 Configuración Inicial

### 1. Configurar API Token

**IMPORTANTE**: Antes de usar la aplicación, debes configurar tu API token:

1. Copia el archivo de configuración de ejemplo:
   ```bash
   cp config.example.js config.js
   ```

2. Edita `config.js` y reemplaza `"TU_API_TOKEN_AQUI"` con tu token real de la API.

3. **NUNCA subas el archivo `config.js` a GitHub** - ya está incluido en `.gitignore` por seguridad.

### 2. Obtener API Token

Para obtener un token de la API de SUNAT:
1. Visita [API JSON PE](https://api.json-pe.com/)
2. Regístrate y obtén tu API key
3. Configúrala en `config.js`

## 📁 Estructura del Proyecto

```
webAppHTMLGeminiTC/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos CSS modernos
├── js/
│   └── script.js           # Lógica JavaScript
├── config.example.js       # Plantilla de configuración (se puede subir)
├── config.js              # Configuración real (NO subir a GitHub)
├── .gitignore             # Archivos ignorados por Git
└── README.md              # Este archivo
```

## 🔒 Seguridad

- ✅ API tokens están en archivo separado (`config.js`)
- ✅ `config.js` está en `.gitignore` 
- ✅ Se incluye `config.example.js` como plantilla
- ✅ Validación de token en el frontend

## 🖥️ Uso

1. Abre `index.html` en tu navegador web
2. Selecciona el tipo de consulta:
   - **Fecha del Día**: Consulta automática del día actual
   - **Rango de Fechas**: Selecciona fecha inicio y fin
   - **Mes Completo**: Selecciona año y mes
3. Haz clic en "Consultar"
4. Exporta los resultados a Excel si es necesario

## 🎨 Temas

La aplicación incluye dos temas:
- **Tema Oscuro** (por defecto): Gradientes púrpura/azul
- **Tema Claro**: Gradientes azul claro

Cambia entre temas con el botón en la esquina superior derecha.

## 📱 Responsive Design

La aplicación está optimizada para:
- 🖥️ Escritorio
- 📱 Tablets
- 📱 Móviles

## 🛠️ Tecnologías Utilizadas

- HTML5 semántico
- CSS3 moderno (Variables CSS, Flexbox, Grid)
- JavaScript ES6+ (Async/Await, Fetch API)
- SheetJS para exportación Excel
- API REST de SUNAT

## ⚡ Rendimiento

- Carga asíncrona de datos
- Animaciones CSS optimizadas
- Código JavaScript modular y comentado
- Carga condicional de recursos

## 🤝 Contribuir

1. Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## ⚠️ Nota Importante

**NUNCA commites archivos con API keys o datos sensibles**. Este proyecto está configurado para proteger automáticamente tu información sensible mediante `.gitignore`.