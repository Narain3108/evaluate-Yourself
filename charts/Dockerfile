# Build frontend
FROM node:20 AS build-frontend

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Build backend
FROM node:20

WORKDIR /app/backend

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend source
COPY backend/ .

# Copy built frontend to backend/public (if backend serves frontend)
COPY --from=build-frontend /app/frontend/dist ./public

# Install Python and requirements
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv
RUN python3 -m venv venv
COPY backend/requirements.txt .
RUN . venv/bin/activate && pip install -r req.txt

EXPOSE 8000
CMD ["sh", "-c", ". venv/bin/activate && node server.js"]