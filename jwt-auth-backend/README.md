# JWT Authentication Backend

## Local Development

1. Navigate to backend directory:
   ```bash
   cd jwt-auth-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

## Render Deployment

This project is configured for Render.com deployment with `render.yaml`.

### Steps:
1. Push changes to your GitHub repository
2. In Render dashboard, link to your `jwt-auth-backend` GitHub repo
3. Render will auto-detect `render.yaml` and deploy from root directory (`./`)
4. Build command: `npm install`
5. Start command: `npm start` (runs `node server.js`)
6. API will be available at your Render URL (e.g., `https://your-app.onrender.com`)

### Important Notes:
- Uses `db.json` for data persistence (Render provides ephemeral filesystem - data resets on restarts)
- CORS enabled for all origins (adjust in production)
- Port automatically set via `process.env.PORT`

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /products` - Get all products
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `POST /orders` - Create order
- `PUT /orders/:id` - Update order status
- `POST /orders/:id/cancel` - Cancel order

## File Structure
```
.
├── server.js          # Main Express server
├── package.json       # Dependencies & scripts
├── db.json           # Sample data (products, users, orders)
├── render.yaml       # Render deployment config
├── routes/           # API route handlers
└── middleware/       # Authentication middleware
