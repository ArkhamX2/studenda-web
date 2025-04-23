# Use a compact Node.js image as the base image for the build stage
FROM node:slim AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Use a compact Node.js image for the production stage
FROM node:slim AS runner

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/build ./build

# Install a lightweight HTTP server for serving the React app
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Start the React application
CMD ["serve", "-s", "build", "-l", "3000"]
