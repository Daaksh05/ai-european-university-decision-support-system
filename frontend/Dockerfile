# Use official Node.js base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install dependencies separately to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm install

# Copy frontend source code
COPY . .

# Expose port
EXPOSE 3000

# Command to start the application in development mode
CMD ["npm", "start"]
