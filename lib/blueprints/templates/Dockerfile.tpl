# Stage 1: Build
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Run the NodeArch build step
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy only the built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose application port (adjust if needed)
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
