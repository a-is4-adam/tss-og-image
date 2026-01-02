FROM oven/bun:latest

WORKDIR /app

# Copy dependency files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN bun run build

# Set environment variables
# Render will provide the PORT variable, but we can set a default
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the server using Bun
CMD ["bun", ".output/server/index.mjs"]
