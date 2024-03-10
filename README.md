# Api Dedsec

### Descripcion:

API de la pagina web de Dedsec.cl

Ten en cuenta que pasa usar correctamente este proyecto debes
tener instalado Node.JS y una serie de paquetes que esta disponible
en el archivo 'package.json'. Para instalar los paquetes necesarios
ejecuta el siguiente comando
````sh
npm install
````

### Variables de ambiente - dotenv:

````js
PORT=Define el puerto donde se instanciara la aplicacion.
DATABASE_URL='mysql://USER:PASS@SERVER:PORT/DATABASE'
````
Luego para poder correr este servicio en modo desarrollo debes ejecutar el siguiete 
comando en tu terminal
````sh
npm run start
````

### Versionamiento:

- El primero (X) se le conoce como versión mayor y nos indica la versión principal del software. Ejemplo: 1.0.0, 3.0.0
- El segundo (Y) se le conoce como versión menor y nos indica nuevas funcionalidades. Ejemplo: 1.2.0, 3.3.0
- El tercero (Z) se le conoce como revisión y nos indica que se hizo una revisión del código por algun fallo. Ejemplo: 1.2.2, 3.3.4
