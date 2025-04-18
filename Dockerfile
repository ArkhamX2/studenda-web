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

# Build the Next.js application
RUN npm run build

# Use a compact Node.js image for the production stage
FROM node:slim AS runner

# Set the working directory
WORKDIR /app

# Copy the built application and dependencies from the builder stage
COPY --from=builder /app ./

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
