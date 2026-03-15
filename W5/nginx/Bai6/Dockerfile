# Stage 1: Build
FROM node:18 AS build
WORKDIR /app
COPY package.json ./
COPY server.js ./
RUN npm install

# Stage 2: Run
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "start"]
