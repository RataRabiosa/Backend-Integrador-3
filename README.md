# 🔐 Backend - Tienda random

**Autor:** Jesús Rodriguez  

## 🛠️ Caracteristicas
- ✅ Autenticación JWT con expiración de 1 dia
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Gestión de usuarios y productos
- ✅ Autenticación de usuarios
- ✅ Email de bienvenida, recuperación de contraseña (forgot-password) y resumen de ordenes
- ✅ Integración con MongoDB
- ✅ Órdenes vinculadas a usuarios
- ✅ Variables de entorno con dotenv
- ✅ Validación de datos con express-validator
- ✅ CORS configurado
---

## 🚀 Instalación y Ejecución

### 1️⃣ Clonar el repositorio  
```bash
git clone https://github.com/RataRabiosa/Backend-Integrador-3.git
cd Backend-Integrador-3
```
### 2️⃣ Instalar dependencias
```bash
npm install
```
### 3️⃣ Crear archivo .env con los parametros necesarios
```bash
cat >> .env << EOF
HTTP_PORT=8080
JWT_SECRET=mysupersecret
JWT_LIFETIME=1d
MONGODB_URI=mongodburl
GOOGLE_APP_PASSWORD=myapppassword
FRONTEND_URL=http://localhost:5173
EOF
```
### 4️⃣ Ejecutar API server
```bash
npm run dev
```
## 📡 Rutas de usuarios

### 1️⃣ POST /api/v1/user/register

#### Parámetros requeridos:

- firstName
- lastName
- email
- password
- userRole (opcional, default: "user")

#### 📌 Ejemplo de request:
```
curl -X POST http://localhost:8080/api/v1/user/register \
--header 'Content-Type: application/json' \
--data '{"firstName":"john","lastName":"doe","email":"john@example.com", "password":"johndoe123"}'
````

### 2️⃣ POST /api/v1/user/login

#### Parámetros requeridos:

- email
- password

#### 📌 Ejemplo de request:
```
curl -X POST http://localhost:8080/api/v1/user/login \
--header 'Content-Type: application/json' \
--data '{"email":"john@example.com","password":"johndoe123"}'
```

### 3️⃣ GET /api/v1/user/profile
#### Parámetros requeridos:
- Bearer token

#### 📌 Ejemplo de request:
```
curl http://localhost:8080/api/v1/user/profile \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiamVzdXMiLCJjb3JyZW8iOiJhYmNAMTIzLmNvbSIsImlhdCI6MTc2Mzc2MzIzNSwiZXhwIjoxNzYzNzY2ODM1fQ.juJaculB2ogO6TM-o5ng7YiGGLSwSpcOQ8nv4IIgK10'
```

### 4️⃣ GET /api/v1/user (solo admin)
#### Parámetros requeridos:
- Bearer token
  
#### 📌 Ejemplo de request:
```
curl http://localhost:8080/api/v1/user \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiamVzdXMiLCJjb3JyZW8iOiJhYmNAMTIzLmNvbSIsImlhdCI6MTc2Mzc2MzIzNSwiZXhwIjoxNzYzNzY2ODM1fQ.juJaculB2ogO6TM-o5ng7YiGGLSwSpcOQ8nv4IIgK10'
```

### 5️⃣ DELETE /api/v1/user/:id (solo admin)
#### Parámetros requeridos:
- Bearer token
  
#### 📌 Ejemplo de request:
```
curl -X DELETE http://localhost:8080/api/v1/user/12345 \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiamVzdXMiLCJjb3JyZW8iOiJhYmNAMTIzLmNvbSIsImlhdCI6MTc2Mzc2MzIzNSwiZXhwIjoxNzYzNzY2ODM1fQ.juJaculB2ogO6TM-o5ng7YiGGLSwSpcOQ8nv4IIgK10'
```
### 6️⃣ POST /api/v1/user/forgot-password
#### Parámetros requeridos:
- email

#### 📌 Ejemplo de request:
```
curl -X POST http://localhost:8080/api/v1/user/forgot-password \
--header 'Content-Type: application/json' \
--data '{"email":"john@example.com"}'
```

### 7️⃣ POST /api/v1/user/reset-password?token=<token>
#### Parámetros requeridos:
- recovery token
- newPassword

#### 📌 Ejemplo de request:
```
curl -X POST http://localhost:8080/api/v1/user/reset-password?token=KcY7YsvwTesTdA4d9FUn \
--header 'Content-Type: application/json' \
--data '{"newPassword":"123456"}'
```

## 📡 Rutas de productos
### 1️⃣ GET /api/v1/product

#### 📌 Ejemplo de request:
```
curl -X GET http://localhost:8080/api/v1/product \
--header 'Content-Type: application/json'
````

### 2️⃣ GET /api/v1/product/:id
#### Parámetros requeridos:
- Product id

#### 📌 Ejemplo de request:
```
curl -X GET http://localhost:8080/api/v1/product/abc123 \
--header 'Content-Type: application/json'
````

### 3️⃣ POST /api/v1/product (solo admin)
#### Parámetros requeridos:
- Bearer token
- name
- price
- description
- stock
- category
- image

#### 📌 Ejemplo de request:
```
curl -X POST http://localhost:8080/api/v1/product \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiamVzdXMiLCJjb3JyZW8iOiJhYmNAMTIzLmNvbSIsImlhdCI6MTc2Mzc2MzIzNSwiZXhwIjoxNzYzNzY2ODM1fQ.juJaculB2ogO6TM-' \
--data {"name": "Apple", "price": 1.99, "description": "A delicious apple", "stock": 10, "category": "fruits", "image": "http://myimageurl.co"}
````

### 4️⃣ PATCH /api/v1/product/:id (solo admin)
#### Parámetros requeridos:
- Product id
- Bearer token

#### 📌 Ejemplo de request:
```
curl -X PATCH http://localhost:8080/api/v1/product/abc123 \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiamVzdXMiLCJjb3JyZW8iOiJhYmNAMTIzLmNvbSIsImlhdCI6MTc2Mzc2MzIzNSwiZXhwIjoxNzYzNzY2ODM1fQ.juJaculB2ogO6TM-' \
--data {"price": 10.99}
````

### 5️⃣ DELETE /api/v1/product/:id (solo admin)
#### Parámetros requeridos:
- Product id
- Bearer token

#### 📌 Ejemplo de request:
```
curl -X DELETE http://localhost:8080/api/v1/product/abc123 \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiamVzdXMiLCJjb3JyZW8iOiJhYmNAMTIzLmNvbSIsImlhdCI6MTc2Mzc2MzIzNSwiZXhwIjoxNzYzNzY2ODM1fQ.juJaculB2ogO6TM-'
