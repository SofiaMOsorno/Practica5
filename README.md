# Practica5 - Songs API con CI/CD

API RESTful para gestión de canciones implementando pipelines de CI/CD y principios de aplicaciones de 12 factores.

## Objetivos de la Práctica

- Implementar un flujo de Continuous Integration/Continuous Delivery (CI/CD) para desplegar una aplicación
- Reforzar los conceptos de una aplicación de 12 factores
- Manejar los conceptos de contenedores y repositorios de contenedores en nubes públicas

## Tecnologías

- **Runtime:** Node.js 20 + TypeScript
- **Framework:** Express.js
- **Base de Datos:** AWS DynamoDB (clave-valor)
- **Containerización:** Docker + AWS ECR
- **CI/CD:** GitHub Actions
- **Deploy:** AWS EC2

## Estructura del Proyecto

```
Practica5/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Pipeline de CI/CD
├── src/
│   ├── config/
│   │   ├── environment.ts     # Configuración de variables de entorno
│   │   └── database.ts        # Cliente de DynamoDB
│   ├── models/
│   │   └── song.model.ts      # Modelo y validaciones
│   ├── routes/
│   │   └── songs.routes.ts    # Rutas REST
│   ├── controllers/
│   │   └── songs.controller.ts # Controladores HTTP
│   ├── services/
│   │   └── songs.service.ts   # Lógica de base de datos
│   ├── middlewares/
│   │   └── errorHandler.ts    # Manejo de errores
│   └── index.ts               # Punto de entrada
├── scripts/
│   └── adminProcess.ts        # Factor 12 - Proceso administrativo
├── tests/
│   └── health.test.ts         # Test básico de salud
├── .env                        # Variables locales (no se sube)
├── .env.example               # Plantilla de variables
├── .gitignore
├── Dockerfile                 # Definición de imagen Docker
├── package.json
├── tsconfig.json
└── README.md
```

## Instalación y Uso Local

### **Prerrequisitos**
- Node.js 20+
- npm
- Cuenta de AWS con acceso a DynamoDB
- Tablas DynamoDB creadas: canciones_local y canciones_prod

### **1. Clonar el repositorio**
```bash
git clone https://github.com/SofiaMOsorno/Practica5.git
cd Practica5
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**

Crea un archivo .env en la raíz:
```env
NODE_ENV=local
PORT=3000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_SESSION_TOKEN=tu_session_token
```

### **4. Ejecutar en modo desarrollo**
```bash
npm run dev
```

La API estará disponible en: http://localhost:3000

### **5. Compilar para producción**
```bash
npm run build
npm start
```

---

## Ejecutar Tests

```bash
npm test
```

---

## Ejecutar Proceso Administrativo

```bash
npm run admin
```

Este comando ejecuta el script de purga de registros antiguos (Factor 12 de 12-Factor App). El script elimina canciones creadas hace más de 30 días de la tabla de DynamoDB correspondiente al ambiente configurado.

---

## Endpoints de la API

### **Health Check**
```http
GET /health
```
**Respuesta:**
```json
{
  "status": "OK",
  "environment": "local",
  "timestamp": "2024-11-14T10:30:00.000Z",
  "table": "canciones_local"
}
```

### **CRUD de Canciones**

#### Crear canción
```http
POST /api/songs
Content-Type: application/json

{
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "album": "A Night at the Opera",
  "year": 1975,
  "genre": "Rock",
  "duration": 354
}
```

#### Listar todas las canciones
```http
GET /api/songs
```

#### Obtener canción por ID
```http
GET /api/songs/:id
```

#### Actualizar canción
```http
PUT /api/songs/:id
Content-Type: application/json

{
  "year": 1976
}
```

#### Eliminar canción
```http
DELETE /api/songs/:id
```

## Pipeline de CI/CD

El pipeline se ejecuta automáticamente en cada push a main:

### **Stage 1: Build**
- Instala dependencias
- Compila TypeScript
- Ejecuta tests

### **Stage 2: Docker**
- Construye imagen Docker
- Genera tags únicos (latest, commit-sha, build-N, timestamp)
- Sube imagen a AWS ECR

### **Stage 3: Deploy**
- Conecta a EC2 por SSH
- Descarga imagen desde ECR
- Despliega contenedor con variables de producción

### **Stage 4: Admin Process**
- Ejecuta proceso administrativo de purga
- Elimina registros antiguos de la tabla de producción
- Se ejecuta automáticamente después del deploy


## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Ambiente de ejecución | `local` o `prod` |
| `PORT` | Puerto del servidor | `3000` |
| `AWS_REGION` | Región de AWS | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | Access Key de AWS | `ASIA...` |
| `AWS_SECRET_ACCESS_KEY` | Secret Key de AWS | `...` |
| `AWS_SESSION_TOKEN` | Token de sesión (AWS Academy) | `IQoJb3...` |


## Configuración para AWS Academy

### **Cada vez que inicies el laboratorio:**

#### **1. Obtén las nuevas credenciales**
En AWS Details del launcher, copia:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_SESSION_TOKEN

#### **2. Actualiza secretos en GitHub**
Ve a: Settings → Secrets and variables → Actions

Actualiza estos secretos:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN`
- `EC2_HOST`

#### **3. Verifica que EC2 esté corriendo**
Asegúrate de que la instancia EC2 esté activa en la consola de AWS.

#### **4. Re-run del pipeline (si es necesario)**
Si el pipeline falló por credenciales expiradas:
- Ve a Actions en GitHub
- Selecciona el workflow fallido
- Click en "Re-run all jobs"


## Aplicación Desplegada

- **Base URL:** http://54.197.119.170
- **Health Check:** http://54.197.119.170/health
- **API Endpoint:** http://54.197.119.170/api/songs

**Nota:** La IP puede cambiar cada vez que se reinicia el laboratorio de AWS.

## Docker

### **Ejecutar localmente con Docker**
```bash
docker build -t songs-api .

docker run -p 3000:3000 \
  -e NODE_ENV=local \
  -e AWS_REGION=us-east-1 \
  -e AWS_ACCESS_KEY_ID=tu_key \
  -e AWS_SECRET_ACCESS_KEY=tu_secret \
  -e AWS_SESSION_TOKEN=tu_token \
  songs-api
```

### **Versionado de Imágenes**
Cada build genera 4 tags únicos para mantener historial de versiones:
- latest - Siempre apunta a la versión más reciente
- <commit-sha> - Identificador del commit de Git
- build-<number> - Número secuencial del pipeline
- <timestamp> - Marca temporal única

Todas las versiones se publican en AWS ECR y están disponibles para deploy o rollback.

## Base de Datos
### **Tablas DynamoDB**
- **Local:** canciones_local
- **Producción:** canciones_prod

La selección de tabla se realiza dinámicamente mediante la variable NODE_ENV.


## Seguridad

- No hay credenciales en el código
- Variables de entorno para toda configuración
- .env excluido del control de versiones
- Secretos manejados por GitHub Actions
- Autenticación con AWS mediante credenciales temporales