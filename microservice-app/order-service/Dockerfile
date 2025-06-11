# Gunakan image Node.js resmi
FROM node:18-alpine

# Buat direktori kerja
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh kode ke container
COPY . .

# Build project NestJS
RUN npm run build

# Jalankan aplikasi
CMD ["node", "dist/main"]

# Expose port NestJS default
EXPOSE 3000
