# Instala las dependencias de desarrollo
FROM node:20-alpine3.16 as dev-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Construcción de la aplicación
FROM node:20-alpine3.16 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Servir la aplicación con Nginx
FROM nginx:1.23.3
EXPOSE 80
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/vex/ /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
