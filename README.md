# Auto Git Pull Service

## Descripción

Este repositorio contiene un servicio de webhook diseñado para integrarse con GitHub y automatizar el proceso de actualización de repositorios locales en un servidor cada vez que se realiza un push a GitHub. Utiliza webhooks de GitHub para recibir notificaciones de nuevos commits y automáticamente realiza un `git pull` en el repositorio correspondiente en el servidor.

## Características

- **Automatización de Pulls**: Realiza automáticamente `git pull` en el repositorio local cuando se detectan cambios en el repositorio remoto de GitHub.
- **Soporte para Múltiples Repositorios**: Capaz de manejar múltiples repositorios, actualizando solo el repositorio que ha recibido cambios.
- **Seguridad**: Implementa verificaciones básicas para asegurarse de que el directorio del repositorio exista antes de intentar actualizarlo.

## Tecnologías Utilizadas

- Node.js
- Express.js para el servidor de webhook
- `simple-git` para la interacción con los repositorios Git
- `fs` para verificar la existencia de directorios

## Configuración

### Requisitos Previos

Necesitas tener Node.js y npm instalados en tu máquina. Además, es necesario que los repositorios que desees actualizar estén clonados en el servidor donde se ejecutará este servicio.

### Instalación

1. Clona este repositorio en tu servidor:
   ```bash
   git clone <https://github.com/LuisLuna810/GHWHHandler>```

2. Instala las dependencias necesarias:
      ```bash
   npm install```

3. Configura las variables de entorno necesarias en un archivo .env:
   ```bash
   REPOSITORIOS=/path/to/your/repositories```
