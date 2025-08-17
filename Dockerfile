# --- Stage 1: The "Builder" ---
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Build the app for a root path ("/")
RUN npm run build


# --- Stage 2: The "Server" ---
FROM nginx:stable-alpine

# --- SIMPLIFIED COPY ---
# Copy the ENTIRE contents of the 'dist' folder to the Nginx public directory.
# This is simple, robust, and maintains the file structure Vite created.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our simple Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]