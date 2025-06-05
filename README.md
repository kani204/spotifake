# Spotifake

Una plataforma de streaming de música inspirada en Spotify, desarrollada como proyecto de práctica.

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v8 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd spotifake
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Configurar la base de datos:
   - Crear una base de datos MySQL llamada `spotifake`
   - Ejecutar el script SQL en `backend/src/config/database.sql`

4. Configurar variables de entorno:
   - Crear un archivo `.env` en la carpeta `backend` con el siguiente contenido:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=spotifake
   JWT_SECRET=tu_clave_secreta
   ```

5. Instalar dependencias del frontend:
```bash
cd ../frontend
npm install
```

## Ejecución

1. Iniciar el servidor backend:
```bash
cd backend
npm start
```

2. Acceder a la aplicación:
   - Abrir el navegador en `http://localhost:3000`

## Características

- Autenticación de usuarios
- Reproducción de música
- Visualizador de audio
- Gestión de playlists
- Búsqueda de canciones
- Interfaz responsive

## Tecnologías Utilizadas

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - p5.js (para visualización de audio)

- Backend:
  - Node.js
  - Express
  - MySQL
  - Sequelize
  - JWT para autenticación

## Estructura del Proyecto

```
spotifake/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   └── package.json
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
└── README.md
```

## Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Link del Proyecto: [https://github.com/kani204/spotifake](https://github.com/kani204/spotifake) 
