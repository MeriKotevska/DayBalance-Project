FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy the rest of the project.
COPY . .

# Default env values (can be overridden in docker-compose.yml).
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server/index.js"]
