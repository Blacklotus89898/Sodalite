# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Ensure the uploads directory exists
RUN mkdir -p uploads

# Expose the port your server will run on
EXPOSE 8081

# Define the command to run your server
CMD ["node", "server.js"]