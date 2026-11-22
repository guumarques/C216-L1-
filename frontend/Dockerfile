FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173

# Servidor do Vite acessível de fora do container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
