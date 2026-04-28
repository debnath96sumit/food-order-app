# 🍕 FoodRush — Food Order Management App

A full-stack food ordering application built as part of a Sr. Full Stack Developer assessment. Users can browse a menu, add items to their cart, place orders, and track order status in real time.

---

## Tech Stack

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Socket.io (real-time order status)
- Zod (request validation)
- Jest + Supertest (testing)
- Swagger (API docs, development only)

**Frontend**
- React + Vite + TypeScript
- Tailwind CSS v4
- Axios (API calls)
- Socket.io-client (real-time updates)
- React Router v6

---

## Project Structure

```
food-order-app/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── interfaces/      # TypeScript interfaces & enums
│   │   ├── models/          # Mongoose schemas
│   │   ├── repositories/    # Data access layer (base + domain-specific)
│   │   ├── services/        # Business logic layer
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── routes/          # Express route definitions + Swagger JSDoc
│   │   ├── socket/          # Socket.io gateway
│   │   ├── validations/     # Zod schemas
│   │   ├── middlewares/     # Error handler, validation middleware
│   │   ├── utils/           # Consistent API response helper
│   │   └── seed/            # Menu seed script
│   └── tests/               # Jest + Supertest API tests
└── frontend/
    └── src/
        ├── api/             # Axios instance + API functions
        ├── context/         # CartContext (global cart state)
        ├── hooks/           # useOrderSocket (Socket.io)
        ├── pages/           # MenuPage, CheckoutPage, OrderTrackingPage
        ├── components/      # MenuItemCard, Cart, CartItem, OrderStatusStepper
        └── types/           # Shared TypeScript interfaces
```

---

## Architecture

### Backend

Follows a layered architecture:

```
Request → Route → Controller → Service → Repository → MongoDB
```

- **Controller** — handles HTTP req/res, delegates to service
- **Service** — business logic, orchestration (e.g. order status simulation)
- **Repository** — data access only, built on a generic `BaseRepository<T>`

### Real-Time Order Status

After an order is placed, the backend simulates status progression asynchronously (fire-and-forget — does not block the HTTP response):

```
Order Received → (15s) → Preparing → (20s) → Out for Delivery → (30s) → Delivered
```

Each transition updates MongoDB and emits a `order:status_update` Socket.io event to the order-specific room. The frontend joins that room via `join:order` after placing an order and updates the UI in real time.

### Frontend

- Global state is limited to the cart (`CartContext`) — everything else is local `useState`
- A singleton Socket.io client is shared across the app via `useOrderSocket` hook — no duplicate connections
- Three-page linear flow: Menu → Checkout → Order Tracking

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/food-order-app.git
cd food-order-app
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Fill in your MONGODB_URI in .env
npm install
```

Seed the menu:

```bash
npm run seed
```

Start the dev server:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`
Swagger docs at `http://localhost:5000/api/docs` (development only)

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Environment Variables

### `backend/.env.example`

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### `frontend/.env.example`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all available menu items |
| GET | `/api/menu?category=Pizza` | Filter menu by category |
| GET | `/api/menu/:id` | Get single menu item |
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders/:id` | Get order by ID |

Full interactive docs available at `/api/docs` in development.

### Place Order — Request Body

```json
{
  "items": [
    {
      "menuItemId": "664f1a...",
      "name": "Margherita Pizza",
      "price": 299,
      "quantity": 2
    }
  ],
  "deliveryDetails": {
    "name": "John Doe",
    "address": "123 Main St, Kolkata",
    "phone": "+91 9876543210"
  }
}
```

---

## Running Tests

```bash
cd backend
npm test
```

Tests cover:
- Menu retrieval (all items, by category, by ID)
- Order placement (valid, invalid payload, empty cart)
- Order retrieval
- Input validation (missing fields, wrong types)

---

## Deployment

| Layer | Platform |
|-------|----------|
| Backend | Render (free tier) |
| Frontend | Vercel |
| Database | MongoDB Atlas (free tier) |

> Render is used over Vercel for the backend because Vercel's serverless functions do not support persistent WebSocket connections required by Socket.io.

---

## Design Decisions & Trade-offs

**No authentication** — Out of scope for this assessment. Delivery details captured at checkout serve as order context.

**Server-side total calculation** — `totalAmount` is computed on the backend from submitted item prices, never trusted from the client.

**Repository pattern** — Separates data access from business logic. The generic `BaseRepository<T>` provides common CRUD operations; domain repositories extend it with specific queries.

**Fire-and-forget status simulation** — `simulateStatusProgression()` is called without `await` in `createOrder()` so the HTTP response returns immediately. Each step updates MongoDB before emitting the socket event, ensuring the DB is always the source of truth even if the client reconnects mid-progression.

**Socket.io room per order** — Instead of broadcasting status updates to all connected clients, each client joins a room keyed by `orderId`. Only that client receives updates for their order.