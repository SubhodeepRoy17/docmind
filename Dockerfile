FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build Next.js app
RUN pnpm run build

# Expose port
EXPOSE 3000

# Run the application
CMD ["pnpm", "start"]
