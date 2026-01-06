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
**Descripción:** Registrar usuario
#### Parámetros requeridos:

- firstName
- lastName
- email
- password
- userRole (opcional, default: "user", permitidos: "user" o "admin")

#### 📌 Ejemplo de request:
```
curl -X POST http://localhost:8080/api/v1/user/register \
--header 'Content-Type: application/json' \
--data '{"firstName":"john","lastName":"doe","email":"john@example.com", "password":"johndoe123"}'
````

### 2️⃣ POST /api/v1/user/login
**Descripción:** Iniciar sesión
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
**Descripción:** Obtener perfil del usuario
#### Parámetros requeridos:
- Bearer token

#### 📌 Ejemplo de request:
```
curl http://localhost:8080/api/v1/user/profile \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiamVzdXMiLCJjb3JyZW8iOiJhYmNAMTIzLmNvbSIsImlhdCI6MTc2Mzc2MzIzNSwiZXhwIjoxNzYzNzY2ODM1fQ.juJaculB2ogO6TM-o5ng7YiGGLSwSpcOQ8nv4IIgK10'
```

### 4️⃣ GET /api/v1/user (solo admin)
**Descripción:** Listar todos los usuarios
#### Parámetros requeridos:
- Bearer token
  
#### 📌 Ejemplo de request:
```
curl http://localhost:8080/api/v1/user \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiamVzdXMiLCJjb3JyZW8iOiJhYmNAMTIzLmNvbSIsImlhdCI6MTc2Mzc2MzIzNSwiZXhwIjoxNzYzNzY2ODM1fQ.juJaculB2ogO6TM-o5ng7YiGGLSwSpcOQ8nv4IIgK10'
```

### 5️⃣ DELETE /api/v1/user/:id (solo admin)
**Descripción:** Borrar usuario
#### Parámetros requeridos:
- Bearer token
  
#### 📌 Ejemplo de request:
```
curl -X DELETE http://localhost:8080/api/v1/user/12345 \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiamVzdXMiLCJjb3JyZW8iOiJhYmNAMTIzLmNvbSIsImlhdCI6MTc2Mzc2MzIzNSwiZXhwIjoxNzYzNzY2ODM1fQ.juJaculB2ogO6TM-o5ng7YiGGLSwSpcOQ8nv4IIgK10'
```
### 6️⃣ POST /api/v1/user/forgot-password
**Descripción:** Iniciar flujo de recuperacion de contraseña
#### Parámetros requeridos:
- email

#### 📌 Ejemplo de request:
```
curl -X POST http://localhost:8080/api/v1/user/forgot-password \
--header 'Content-Type: application/json' \
--data '{"email":"john@example.com"}'
```

### 7️⃣ POST /api/v1/user/reset-password?token=<token>
**Descripción:** Resetear contraseña
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
**Descripción:** Obtener lista de productos
#### 📌 Ejemplo de request:
```
curl http://localhost:8080/api/v1/product \
--header 'Content-Type: application/json'
````

### 2️⃣ GET /api/v1/product/:id
**Descripción:** Obtener informacion de un producto especifico
#### Parámetros requeridos:
- Product id

#### 📌 Ejemplo de request:
```
curl http://localhost:8080/api/v1/product/abc123 \
--header 'Content-Type: application/json'
````

### 3️⃣ POST /api/v1/product (solo admin)
**Descripción:** Añadir producto nuevo
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
**Descripción:** Actualizar producto
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
**Descripción:** Borrar producto
#### Parámetros requeridos:
- Product id
- Bearer token

#### 📌 Ejemplo de request:
```
curl -X DELETE http://localhost:8080/api/v1/product/abc123 \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiamVzdXMiLCJjb3JyZW8iOiJhYmNAMTIzLmNvbSIsImlhdCI6MTc2Mzc2MzIzNSwiZXhwIjoxNzYzNzY2ODM1fQ.juJaculB2ogO6TM-'
```

## 📡 Rutas de ordenes

### 1️⃣ GET /api/v1/order
**Descripción:** Listar ordenes del usuario
#### Parámetros requeridos:
- Bearer token

#### 📌 Ejemplo de request:
```
curl http://localhost:8080/api/v1/order \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiamVzdXMiLCJjb3JyZW8iOiJhYmNAMTIzLmNvbSIsImlhdCI6MTc2Mzc2MzIzNSwiZXhwIjoxNzYzNzY2ODM1fQ.juJaculB2ogO6TM-'
```

### 2️⃣ GET /api/v1/order/all (solo admin)
**Descripción:** Listar todas las ordenes
#### Parámetros requeridos:
- Bearer token

#### 📌 Ejemplo de request:
```
curl http://localhost:8080/api/v1/order/all \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiamVzdXMiLCJjb3JyZW8iOiJhYmNAMTIzLmNvbSIsImlhdCI6MTc2Mzc2MzIzNSwiZXhwIjoxNzYzNzY2ODM1fQ.juJaculB2ogO6TM-'
```

### 3️⃣ POST /api/v1/order
**Descripción:** Crear nueva orden
#### Parámetros requeridos:
- Bearer token
- Products (array)
   - id
   - name
   - price
   - quantity
   - subtotal
- totalItems
- totalPrice
  
#### 📌 Ejemplo de request:
```
curl --location 'http://localhost:8080/api/v1/order' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6eyJfaWQiOiI2OTU1NDc3YTI3ZDRmMjIyMGNmOTgwNzkiLCJmaXJzdE5hbWUiOiJKZXN1cyIsImxhc3ROYW1lIjoiUm9kcmlndWV6IiwiZW1haWwiOiJyb2RyaWd1ZXouMDIxMkBob3RtYWlsLmNvbSIsInVzZXJSb2xlIjoidXNlciIsInZlcmlmaWVkIjpmYWxzZSwiY3JlYXRlZEF0IjoiMjAyNS0xMi0zMVQxNTo1NTozOC40NDlaIiwidXBkYXRlZEF0IjoiMjAyNi0wMS0wNlQwMzowOTowNS44NDNaIiwiX192IjowfSwiaWF0IjoxNzY3NjcxMzc3LCJleHAiOjE3Njc3NTc3Nzd9.89qxYaRy_oSR2XStPr_8CRSMkla7EBQtnT7LBqJ3tX8' \
--data '{
    "products": [
        {
            "id": "6938c4f9195477b04073197d",
            "name": "Razer BlackWidow V4 Pro",
            "price": 349999,
            "quantity": 3,
            "subtotal": 1050000
        },
        {
            "id": "6938c4f9195477b040731980",
            "name": "Logitech G Pro X Superlight",
            "price": 299999,
            "quantity": 1,
            "subtotal": 299999
        }
    ],
    "totalItems": 4,
    "totalPrice": 1349996
}'
```
