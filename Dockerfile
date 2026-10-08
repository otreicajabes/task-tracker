FROM node:20-alpine

WORKDIR /app

# Copy package files first so Docker can cache the dependency install
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the app code
COPY src ./src
COPY public ./public

ENV PORT=4000
EXPOSE 4000

CMD ["node", "src/server.js"]