FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm install -D typescript @types/node @types/express && \
    npm run build

EXPOSE 3000
CMD ["node", "dist/src/index.js"]