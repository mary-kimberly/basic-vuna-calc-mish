# Use an official lightweight Node.js runtime environment
FROM node:20-alpine

# Set the active working directory inside the container
WORKDIR /app

# Copy package management files first to optimize layer caching
COPY package*.json ./
RUN npm ci

# Copy your actual calculator files (index.html, styles.css, script.js, and src/)
COPY . .

# Inform Docker that the web traffic travels through port 3000
EXPOSE 3000

# Fire up your server script when the container spins up live
CMD ["node", "src/server.js"]