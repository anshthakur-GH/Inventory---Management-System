# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --include=dev

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port (change if your app uses a different port)
EXPOSE 3000

# Start the app
CMD ["npm", "start"] 