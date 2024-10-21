# Auto Git Pull Service

## Descripción

Este repositorio contiene un servicio de webhook diseñado para integrarse con GitHub y automatizar el proceso de actualización de repositorios locales en un servidor cada vez que se realiza un push a GitHub. Utiliza webhooks de GitHub para recibir notificaciones de nuevos commits y automáticamente realiza un `git pull` en el repositorio correspondiente en el servidor, con soporte para actualizaciones sin tiempo de inactividad y rollback en caso de fallos.

## Características

- **Automatización de Pulls**: Realiza automáticamente `git pull` en el repositorio local cuando se detectan cambios en el repositorio remoto de GitHub.
- **Soporte para Múltiples Repositorios**: Capaz de manejar múltiples repositorios, actualizando solo el repositorio que ha recibido cambios.
- **Zero Downtime Deployment**: Utiliza PM2 para recargar los servicios sin interrumpir la versión actual mientras se despliega la nueva.
- **Rollback en Caso de Falla**: En caso de que el build falle o haya un problema durante el despliegue, el sistema revierte a la versión anterior automáticamente.
- **Verificación de Dependencias**: Si el `package.json` ha cambiado, se instalan automáticamente las dependencias necesarias antes de reiniciar el servicio.
- **Monitoreo de Procesos con PM2**: Ofrece endpoints para listar los procesos actuales en PM2, verificar su estado y comprobar la salud de los mismos.
- **Seguridad**: Implementa verificaciones para asegurarse de que el directorio del repositorio exista antes de intentar actualizarlo.

## Tecnologías Utilizadas

- Node.js
- Express.js para el servidor de webhook
- `simple-git` para la interacción con los repositorios Git
- `pm2` para la gestión de los procesos Node.js
- `fs` para verificar la existencia de directorios
- `dotenv` para la configuración de variables de entorno

## Configuración

### Requisitos Previos

1. **Node.js** y **npm** deben estar instalados en tu servidor.
2. Los repositorios que desees actualizar deben estar clonados en el servidor.
3. **PM2** debe estar instalado para gestionar los procesos Node.js:
   ```bash
   npm install pm2 -g

### Instalación

1. Clona este repositorio en tu servidor:
   ```bash
   git clone <https://github.com/LuisLuna810/GHWHHandler>

2. Instala las dependencias necesarias:
      ```bash
   npm install

3. Configura las variables de entorno necesarias en un archivo .env:
   ```bash
   REPOSITORIOS=/path/to/your/repositories


### Uso

1. Iniciar el servidor de webhook: Ejecuta el servidor para empezar a recibir las notificaciones de GitHub.

2. Configurar los webhooks en GitHub: En el repositorio de GitHub que desees integrar, ve a Settings > Webhooks y agrega un nuevo webhook apuntando a tu servidor (por ejemplo, http://your-server-ip/webhook). Asegúrate de enviar eventos de push.

### PM2 Zero Downtime y Rollback
El sistema está configurado para usar PM2 y garantizar que las actualizaciones se hagan sin tiempo de inactividad. Aquí está cómo funciona:

- Zero Downtime: Cada vez que se detecta un cambio en el repositorio, se ejecuta un git pull y, si todo es exitoso, PM2 recarga el servicio con el comando pm2 reload, manteniendo la versión actual activa hasta que la nueva esté lista.
- Rollback: Si alguna parte del proceso falla (por ejemplo, si npm install o el build fallan), el sistema revertirá a la versión anterior automáticamente.

### Control y Monitoreo de PM2

Hemos añadido varias rutas para controlar y monitorear el estado de los procesos gestionados por PM2:

#### Rutas Disponibles:

- **Listar todos los procesos de PM2:**

  ```bash
  GET /pm2/processes

- **Obtener el estado de un proceso específico por nombre:**

  ```bash
  GET /pm2/process/:name

- **Verificar la salud de un proceso específico:**

  ```bash
  GET /pm2/process/:name/health

