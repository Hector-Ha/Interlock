# Use the official Bun image
FROM oven/bun:1

WORKDIR /app

# Copy package files first for caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Run as non-root user
USER bun

# Command to run the application
CMD ["bun", "start"]
