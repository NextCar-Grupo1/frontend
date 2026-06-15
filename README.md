# NextCar Frontend

Frontend web para la simulacion de credito vehicular por Compra Inteligente.

## Requisitos

- Node.js instalado.
- npm instalado.

## Instalar dependencias

Desde la carpeta del proyecto:

```bash
cd C:\Users\usuario\Desktop\frontend-finanzas\nextcar-frontend
npm install
```

## Ejecutar json-server

`json-server` usa el archivo `server/db.json` como fake API para usuarios, vehiculos, entidades financieras, simulaciones, conceptos de gasto y logs. El archivo `server/routes.json` replica el patron del proyecto de ejemplo y redirige todo `/api/v1/*` al recurso correspondiente.

Ejecuta:

```bash
npm run api
```

La fake API quedara disponible en:

```txt
http://localhost:3000
```

Endpoints principales directos:

```txt
http://localhost:3000/usuarios
http://localhost:3000/vehiculos
http://localhost:3000/entidadesFinancieras
http://localhost:3000/simulaciones
http://localhost:3000/conceptosGasto
http://localhost:3000/logsOperacion
```

Rutas con prefijo de API usadas por el frontend:

```txt
http://localhost:3000/api/v1/usuarios
http://localhost:3000/api/v1/vehiculos
http://localhost:3000/api/v1/entidadesFinancieras
http://localhost:3000/api/v1/simulaciones
http://localhost:3000/api/v1/conceptosGasto
http://localhost:3000/api/v1/logsOperacion
```

## Ejecutar servidor Angular

En otra terminal, desde la misma carpeta del proyecto:

```bash
npm start
```

La aplicacion quedara disponible en:

```txt
http://localhost:4200
```

## Ejecutar frontend y fake API juntos

Tambien puedes levantar Angular y `json-server` con un solo comando:

```bash
npm run dev
```

Este comando ejecuta:

- `json-server` en `http://localhost:3000`
- Angular en `http://localhost:4200`

## Usuario demo

Puedes iniciar sesion con:

```txt
Correo: juan.perez@nextcar.pe
Contrasena: NextCar123
```

## Compilar el proyecto

Para validar que el proyecto compile correctamente:

```bash
npm run build
```

Los archivos compilados se generaran en la carpeta `dist/`.
