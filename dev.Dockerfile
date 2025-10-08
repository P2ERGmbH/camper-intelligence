# Use the official Node.js 20 image.
FROM node:20

# Create and change to the app directory.
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "dev"]
