# eCommerce Node.js API

A full-featured REST API converted from Spring Boot to **Node.js + Express + MongoDB**.

---

## 🚀 Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Runtime     | Node.js                 |
| Framework   | Express.js              |
| Database    | MongoDB + Mongoose      |
| Auth        | JWT (jsonwebtoken)      |
| Password    | bcryptjs                |
| File Upload | Multer                  |
| Docs        | Swagger (swagger-jsdoc) |

---

## 📁 Project Structure

```
ecom-node/
├── src/
│   ├── config/
│   │   ├── constants.js       # App-wide constants (page size, sort defaults)
│   │   ├── db.js              # MongoDB connection
│   │   ├── initData.js        # Default user seeder
│   │   └── swagger.js         # Swagger/OpenAPI setup
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── category.controller.js
│   │   ├── product.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── address.controller.js
│   │   └── analytics.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT verification + role guard
│   │   └── validate.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── category.model.js
│   │   ├── product.model.js
│   │   ├── cart.model.js
│   │   ├── address.model.js
│   │   └── order.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── category.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   ├── address.routes.js
│   │   └── analytics.routes.js
│   ├── utils/
│   │   ├── jwt.utils.js
│   │   ├── pagination.utils.js
│   │   └── file.utils.js
│   └── index.js               # App entry point
├── images/                    # Uploaded product images (auto-created)
├── .env.example
├── .gitignore
└── package.json
```

---

## ⚙️ Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRATION_MS=3000000
JWT_COOKIE_NAME=springBootEcom
FRONTEND_URL=http://localhost:5173
IMAGE_BASE_URL=http://localhost:8080/images
STRIPE_SECRET_KEY=your_stripe_key_here
```

### 3. Run the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 4. Access
- **API Base:** `http://localhost:8080/api`
- **Swagger Docs:** `http://localhost:8080/api-docs`

---

## 👤 Default Users (auto-seeded)

| Username | Password   | Role(s)                        |
|----------|------------|--------------------------------|
| user1    | password1  | ROLE_USER                      |
| seller1  | password2  | ROLE_SELLER                    |
| admin    | adminPass  | ROLE_USER, ROLE_SELLER, ROLE_ADMIN |

---

## 🔐 Authentication

All protected routes require a JWT token either:
- **Header:** `Authorization: Bearer <token>`
- **Cookie:** `springBootEcom=<token>`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint              | Access  | Description          |
|--------|-----------------------|---------|----------------------|
| POST   | /api/auth/signin      | Public  | Login                |
| POST   | /api/auth/signup      | Public  | Register             |
| GET    | /api/auth/user        | Auth    | Get current user     |
| GET    | /api/auth/username    | Auth    | Get current username |
| POST   | /api/auth/signout     | Public  | Logout               |
| GET    | /api/auth/sellers     | Admin   | List all sellers     |

### Categories
| Method | Endpoint                          | Access       | Description        |
|--------|-----------------------------------|--------------|--------------------|
| GET    | /api/public/categories            | Public       | List categories    |
| POST   | /api/admin/categories             | Admin/Seller | Create category    |
| PUT    | /api/admin/categories/:id         | Admin/Seller | Update category    |
| DELETE | /api/admin/categories/:id         | Admin        | Delete category    |

### Products
| Method | Endpoint                                    | Access       | Description          |
|--------|---------------------------------------------|--------------|----------------------|
| GET    | /api/public/products                        | Public       | List all products    |
| GET    | /api/public/categories/:id/products         | Public       | Products by category |
| GET    | /api/public/products/keyword/:kw            | Public       | Search by keyword    |
| POST   | /api/admin/categories/:id/product           | Admin/Seller | Add product          |
| PUT    | /api/admin/products/:id                     | Admin/Seller | Update product       |
| DELETE | /api/admin/products/:id                     | Admin/Seller | Delete product       |
| PUT    | /api/admin/products/:id/image               | Admin/Seller | Upload image         |
| GET    | /api/admin/products                         | Admin/Seller | All products (admin) |
| GET    | /api/seller/products                        | Seller       | Seller's products    |

### Cart
| Method | Endpoint                                    | Access | Description          |
|--------|---------------------------------------------|--------|----------------------|
| POST   | /api/cart/create                            | Auth   | Bulk update cart     |
| POST   | /api/carts/products/:id/quantity/:qty       | Auth   | Add item to cart     |
| GET    | /api/carts/users/cart                       | Auth   | Get my cart          |
| GET    | /api/carts                                  | Admin  | All carts            |
| PUT    | /api/cart/products/:id/quantity/:op         | Auth   | Update qty (+/delete)|
| DELETE | /api/carts/:cartId/product/:productId       | Auth   | Remove item          |

### Orders
| Method | Endpoint                              | Access       | Description        |
|--------|---------------------------------------|--------------|--------------------|
| POST   | /api/order/users/payments/:method     | Auth         | Place order        |
| GET    | /api/admin/orders                     | Admin        | All orders         |
| GET    | /api/seller/orders                    | Seller/Admin | Seller's orders    |
| PUT    | /api/admin/orders/:id/status          | Admin        | Update order status|
| PUT    | /api/seller/orders/:id/status         | Seller/Admin | Update order status|

### Addresses
| Method | Endpoint                  | Access | Description          |
|--------|---------------------------|--------|----------------------|
| POST   | /api/addresses            | Auth   | Create address       |
| GET    | /api/addresses            | Auth   | All addresses        |
| GET    | /api/addresses/:id        | Auth   | Get address by ID    |
| GET    | /api/user/addresses       | Auth   | My addresses         |
| PUT    | /api/addresses/:id        | Auth   | Update address       |
| DELETE | /api/addresses/:id        | Auth   | Delete address       |

### Analytics
| Method | Endpoint                  | Access | Description       |
|--------|---------------------------|--------|-------------------|
| GET    | /api/admin/app/analytics  | Admin  | Dashboard stats   |

---

## 🔄 Spring Boot → Node.js Mapping

| Spring Boot                  | Node.js Equivalent              |
|------------------------------|---------------------------------|
| `@RestController`            | `express.Router()`              |
| `@Service`                   | Controller / service functions  |
| `@Repository` / JPA          | Mongoose Model                  |
| `@Entity`                    | Mongoose Schema                 |
| `@ManyToOne`, `@OneToMany`   | `ref:` in Mongoose Schema       |
| `BCryptPasswordEncoder`      | `bcryptjs`                      |
| `JwtUtils`                   | `jsonwebtoken`                  |
| `@PreAuthorize`              | `hasRole()` middleware          |
| `application.properties`    | `.env` file                     |
| `ModelMapper`                | Manual mapping / spread         |
| `Pageable`                   | skip/limit/sort in Mongoose     |
| `CommandLineRunner`          | `initData()` in config          |
| `@Valid` + `BindingResult`   | `express-validator`             |
| `MultipartFile`              | `multer`                        |
| Swagger/SpringDoc            | `swagger-jsdoc` + `swagger-ui`  |
