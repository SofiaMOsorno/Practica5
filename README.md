# Practica5 - Implementación de Pipelines y Aplicaciones de 12 Factores
## Objetivos de la práctica:
- Implementar un flujo de Continuous Integration/Continuous Delivery (CI/CD) para desplegar una aplicación.
- Reforzar los conceptos de una aplicación de 12 factores. 
- Manejar los conceptos de contenedores y de repositorios de contenedores en nubes públicas. 


## Estructura:
Practica5/
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
├── .env
├── .gitignore
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md