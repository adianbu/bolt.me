FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build || (echo "TypeScript build failed" && exit 1)

# Create .env file from example if it doesn't exist
RUN if [ ! -f .env ]; then cp -n .env.example .env || echo "No .env.example found"; fi

EXPOSE 3000

CMD ["node", "dist/index.js"]