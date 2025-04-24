# Use the latest node image
FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the correct port (5173) that Vite uses
EXPOSE 5173

# Start the app using the "vite" development server
CMD ["npm", "run", "dev"]
