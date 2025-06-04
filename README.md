# Spotifake - Plataforma de Streaming de Música

Spotifake es una plataforma de streaming de música inspirada en Spotify, desarrollada como proyecto para la materia de Diseño e Implementación de Sitios Web Dinámicos.

## Características

- 🎵 Reproducción de música en streaming
- 👤 Sistema de autenticación de usuarios
- 🎨 Interfaz moderna y responsiva
- 🎧 Visualizador de ondas de audio
- 📱 Diseño adaptable a diferentes dispositivos

## Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- p5.js para visualizaciones
- p5.sound.js para manejo de audio

### Backend
- Node.js
- Express.js
- MySQL
- JWT para autenticación

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/kani204/spotifake.git
cd spotifake
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la carpeta `backend` con las siguientes variables:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=spotifake
JWT_SECRET=tu_secreto_jwt
```

4. Iniciar el servidor:
```bash
npm start
```

5. Abrir el frontend:
Simplemente abre el archivo `frontend/index.html` en tu navegador.

## Estructura del Proyecto

```
spotifake/
├── backend/
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
└── README.md
```

## Contribuir

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Tu Nombre - [@tutwitter](https://twitter.com/tutwitter)

Link del Proyecto: [https://github.com/kani204/spotifake](https://github.com/kani204/spotifake) 