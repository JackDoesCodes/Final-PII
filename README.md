# Sistema de Turnos Médicos

- Joaquín Baigorria
- Programación II
- ISSD

---

# Descripción

Este es un sistema de gestión de turnos médicos desarrollado con React + Vite en el frontend y Express + MongoDB en el backend, con autenticación JWT y control de acceso por roles.

---

## Tecnologías usadas

**Frontend**
- React 19
- React Router DOM
- Vite

**Backend**
- Node.js
- Express 5
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

**Testing**
- Jest
- Supertest

---

## Estructura del proyecto

```
├── controllers/
│   ├── adminController.js       # Lógica de rutas del panel de admin
│   ├── appointmentController.js # Lógica de rutas de turnos
│   └── authController.js        # Lógica de registro e inicio de sesión
├── middlewares/
│   ├── verifyToken.js           # Verifica JWT en el header de la solicitud
│   └── verifyRole.js            # Verifica el rol del usuario autenticado
├── models/
│   ├── appointment.js           # Esquema de turno
│   ├── doctor.js                # Esquema de doctor
│   └── user.js                  # Esquema de usuario/paciente
├── src/
│   ├── pages/
│   │   ├── AdminPanel.jsx       # Panel de administración
│   │   ├── Appointments.jsx     # Vista de turnos del paciente
│   │   ├── CreateAppointment.jsx# Formulario para pedir turno
│   │   ├── Home.jsx             # Página de inicio
│   │   ├── Login.jsx            # Inicio de sesión
│   │   ├── Register.jsx         # Registro de paciente
│   │   └── RegisterDoctor.jsx   # Registro de doctor (solo admin)
│   ├── styles/                  # Archivos CSS por página
│   ├── utils/
│   │   └── stringManipulation.js# Funciones auxiliares de texto
│   ├── App.jsx                  # Rutas del frontend
│   └── main.jsx                 # Punto de entrada de React
├── tests/
│   └── auth.test.js             # Tests de rutas de autenticación
├── utils/
├── .env                         # Variables de entorno (no incluido en git)
├── app.js                       # Entry point del servidor
├── index.html                   # html root
├── server.js                    # Configuración de Express y rutas
└── vite.config.js               # Configuración de Vite y proxy
```

---

## Instalación

**1. Clonar el repositorio**
```bash
git clone <url-del-repo>
cd final
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Configurar variables de entorno**

Crear un archivo `.env` en la raíz con:
```
MONGO_URI=mongodb://localhost:27017/gestion_medica
PORT=3000
JWT_SECRET=tu_clave_secreta
```

**4. Crear el usuario administrador**

En la consola de MongoDB (`mongosh`):
```javascript
use gestion_medica
db.usuarios.insertOne({
  name: "admin",
  surname: "sistema",
  dni: 00000000,
  password: "<hash_de_bcrypt>",
  role: "admin"
})
```

---

## Uso

**Iniciar el servidor (backend)**
```bash
node app.js
# o con recarga automática:
nodemon server.js
```

**Iniciar el frontend**
```bash
npm run dev
```

El frontend corre en `http://localhost:5173` y el backend en `http://localhost:3000`. Las solicitudes de `/api/...` son redirigidas al backend automáticamente por el proxy de Vite.

**Ejecutar tests**
```bash
npm test
```

---

## Roles y accesos

| Rol | Acceso |
|-----|--------|
| `patient` | Registrarse, iniciar sesión, pedir turnos, ver y cancelar sus propios turnos |
| `doctor` | Iniciar sesión, ver turnos |
| `admin` | Todo lo anterior + panel de administración, registrar doctores, CRUD de usuarios y turnos |

---

## Rutas del backend

### Autenticación
| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | `/api/auth/register` | Registrar nuevo paciente | Público |
| POST | `/api/auth/login` | Iniciar sesión | Público |

### Turnos
| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/doctors` | Listar doctores | Autenticado |
| GET | `/api/appointments` | Ver turnos del usuario | Autenticado |
| POST | `/api/create-appointment` | Crear turno | Autenticado |
| PATCH | `/api/update-appointment` | Cancelar turno | Autenticado |

### Admin
| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | `/api/admin/register-doctor` | Registrar doctor | Admin |
| GET | `/api/admin/users` | Listar usuarios | Admin |
| PATCH | `/api/admin/users/:id` | Editar usuario | Admin |
| DELETE | `/api/admin/users/:id` | Eliminar usuario | Admin |
| GET | `/api/admin/appointments` | Listar todos los turnos | Admin |
| PATCH | `/api/admin/appointments/:id` | Editar turno | Admin |
| DELETE | `/api/admin/appointments/:id` | Eliminar turno | Admin |

---

## Autenticación

El sistema utiliza JWT. Al iniciar sesión o registrarse, el servidor devuelve un token que se almacena en `localStorage`. Este token se envía en el header `Authorization` de cada solicitud protegida:

```
Authorization: Bearer <token>
```

El token contiene el `id`, `name` y `role` del usuario, y expira en 2 horas.

---

## Flujo general

```
Usuario → Login → JWT guardado en localStorage
       → React lee el rol del token
       → Redirige según rol (admin → panel, patient → inicio)
       → Cada solicitud al backend incluye el token
       → El backend verifica token y rol antes de responder
```

---

## Créditos

- Imagen de doctor: https://www.pexels.com/@ivan-s/
- Imagen de centro medico: https://www.pexels.com/@matreding/
- Imagen de recepcion: https://www.pexels.com/@pavel-danilyuk/
