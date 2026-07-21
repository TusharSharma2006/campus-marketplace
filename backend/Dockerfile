# Backend Dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV PORT=5000
EXPOSE 5000
CMD ["node", "server.js"]
