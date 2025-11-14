# Practica5 - Implementación de Pipelines y Aplicaciones de 12 Factores
## Objetivos de la práctica:
- Implementar un flujo de Continuous Integration/Continuous Delivery (CI/CD) para desplegar una aplicación.
- Reforzar los conceptos de una aplicación de 12 factores. 
- Manejar los conceptos de contenedores y de repositorios de contenedores en nubes públicas. 


## Estructura:
```
Practica5/
├── .github/workflows
│           └── database.ts
├── src/
│   ├── config/
│   │   ├── environment.ts
│   │   └── database.ts
│   ├── models/
│   │   └── song.model.ts
│   ├── routes/
│   │   └── songs.routes.ts
│   ├── controllers/
│   │   └── songs.controller.ts
│   ├── services/
│   │   └── songs.service.ts
│   ├── middlewares/
│   │   └── errorHandler.ts
│   └── index.ts
├── tests
│   └── health.test.ts
├── .envs
├── .gitignore
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

## Tecnologías
- Node.js + TypeScript
- Express.js
- AWS DynamoDB
- Docker + ECR
- GitHub Actions
- AWS EC2

## Endpoints
- `GET /health` - Health check
- `GET /api/songs` - Listar canciones
- `GET /api/songs/:id` - Obtener canción
- `POST /api/songs` - Crear canción
- `PUT /api/songs/:id` - Actualizar canción
- `DELETE /api/songs/:id` - Eliminar canción

## Variables de Entorno
```env
NODE_ENV=local|prod
PORT=3000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_SESSION_TOKEN=xxx
```

## Aplicación Desplegada
- **URL:** http://54.87.16.248
- **Health:** http://54.87.16.248/health
- **API:** http://54.87.16.248/api/songs

## Pipeline
1. Build - Compilar TypeScript
2. Lint - Validar código
3. Test - Pruebas unitarias
4. Docker - Construir y subir imagen
5. Security - Escaneo de vulnerabilidades
6. Deploy - Desplegar en EC2