# Questify Backend

A robust Node.js backend API for the Questify application, built with Express.js and MongoDB.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 🔑 **API Key Protection** - Secure API endpoints for frontend-backend communication
- 👥 **User Management** - User profiles, preferences, and statistics
- 🎯 **Quest System** - Create, join, and track quest progress
- 📊 **Analytics & Leaderboards** - User and quest statistics
- 🛡️ **Security** - Rate limiting, input validation, and security headers
- 📝 **Comprehensive API** - RESTful endpoints with detailed documentation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Development**: Nodemon for hot reloading

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd QUESTIFY/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/questify
   JWT_SECRET=your_super_secret_jwt_key_here
   API_KEY_SECRET=your_api_key_for_frontend_communication
   FRONTEND_URL=http://localhost:3000
   ```

4. **Generate API Key for frontend communication**
   ```bash
   node utils/apiKeyGenerator.js generate
   ```
   Copy the generated key to your `.env` file as `API_KEY_SECRET`

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Seed the database** (optional, for sample data)
   ```bash
   npm run seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Public Endpoints

- `GET /health` - Health check
- `GET /api/quests` - Get public quests
- `GET /api/quests/featured` - Get featured quests
- `GET /api/quests/categories` - Get quest categories
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Protected Endpoints (Require Authentication)

- `GET /api/auth/me` - Get current user
- `POST /api/quests` - Create new quest
- `POST /api/quests/:id/join` - Join a quest
- `PUT /api/quests/:id/progress` - Update quest progress
- `GET /api/users/profile` - Get user profile

### API Key Protected Endpoints (For Frontend)

- `GET /api/v1/info` - API information
- `GET /api/v1/stats/overview` - Overview statistics
- `GET /api/v1/search/quests` - Search quests
- `GET /api/v1/leaderboard/users` - User leaderboard

## Authentication

### JWT Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Key Authentication

For protected API endpoints, include the API key in headers:
```
X-API-Key: <your_api_key>
```
or
```
Authorization: Bearer <your_api_key>
```

## Database Models

### User Model
- Profile information (username, email, profile details)
- Statistics (level, experience, quests completed)
- Preferences (theme, notifications)
- Role-based permissions

### Quest Model
- Quest details (title, description, category, difficulty)
- Participation tracking
- Statistics (ratings, completion rates)
- Metadata (featured, trending status)

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests (when implemented)

## API Key Management

Generate new API keys:
```bash
node utils/apiKeyGenerator.js generate
```

Validate API key format:
```bash
node utils/apiKeyGenerator.js validate <api-key>
```

Generate API key with metadata:
```bash
node utils/apiKeyGenerator.js metadata "Frontend App" read write
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/questify |
| `JWT_SECRET` | JWT signing secret | Required |
| `API_KEY_SECRET` | API key for frontend | Required |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: Express Validator for all inputs
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Expiration**: Configurable token expiration

## Error Handling

The API uses consistent error response format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Development

### Adding New Routes

1. Create route file in `/routes`
2. Create controller in `/controllers`
3. Add validation middleware
4. Register route in `server.js`

### Database Seeding

The seed script creates:
- Sample users with different roles
- Sample quests across categories
- Realistic participation data
- Admin user (admin@questify.com / Admin123!)

## Connecting Frontend

To connect your frontend application:

1. **Set the API base URL** in your frontend to `http://localhost:5000/api`

2. **Include the API key** in requests to protected endpoints:
   ```javascript
   const response = await fetch('/api/v1/stats/overview', {
     headers: {
       'X-API-Key': 'your_api_key_here'
     }
   });
   ```

3. **Handle JWT tokens** for authenticated requests:
   ```javascript
   const response = await fetch('/api/users/profile', {
     headers: {
       'Authorization': `Bearer ${userToken}`
     }
   });
   ```

## Support

For issues and questions:
- Check the API documentation
- Review error messages in server logs
- Ensure environment variables are set correctly
- Verify MongoDB connection

## License

MIT License - see LICENSE file for details
