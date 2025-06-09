# Questify Setup Guide

This guide will help you set up the complete Questify application with both frontend and backend.

## 🏗️ Project Structure

```
QUESTIFY/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js/Express backend API
└── SETUP_GUIDE.md    # This file
```

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended

## 🚀 Quick Start

### Step 1: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd QUESTIFY/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Or run the setup script
   node scripts/setup.js
   ```

4. **Configure your .env file**
   Edit `backend/.env` with your settings:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/questify
   JWT_SECRET=your_generated_jwt_secret
   API_KEY_SECRET=your_generated_api_key
   FRONTEND_URL=http://localhost:3000
   ```

5. **Generate API keys** (if not done by setup script)
   ```bash
   node utils/apiKeyGenerator.js generate
   ```
   Copy the generated key to your `.env` file as `API_KEY_SECRET`

6. **Start MongoDB** (if running locally)
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   ```

7. **Seed the database** (optional, for sample data)
   ```bash
   npm run seed
   ```

8. **Start the backend server**
   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:5000`

### Step 2: Frontend Setup

1. **Open a new terminal and navigate to frontend directory**
   ```bash
   cd QUESTIFY/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_API_KEY=your_api_key_from_backend_env
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   The frontend will be available at `http://localhost:3000`

## 🔧 Configuration Details

### Backend Configuration

The backend uses the following key environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/questify` |
| `JWT_SECRET` | Secret for JWT tokens | Generated 64-char string |
| `API_KEY_SECRET` | API key for frontend auth | Generated 64-char string |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend Configuration

The frontend uses these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_API_KEY` | API key for backend auth | Same as backend `API_KEY_SECRET` |

## 🔑 API Key Setup

The API key is crucial for frontend-backend communication:

1. **Generate an API key** in the backend:
   ```bash
   cd backend
   node utils/apiKeyGenerator.js generate
   ```

2. **Add to backend .env**:
   ```env
   API_KEY_SECRET=your_generated_key_here
   ```

3. **Add to frontend .env.local**:
   ```env
   NEXT_PUBLIC_API_KEY=same_key_as_backend
   ```

## 📊 Database Setup

### Local MongoDB

1. **Install MongoDB Community Edition**
2. **Start MongoDB service**
3. **Use default connection**: `mongodb://localhost:27017/questify`

### MongoDB Atlas (Cloud)

1. **Create account** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create cluster**
3. **Get connection string**
4. **Update MONGODB_URI** in backend `.env`

### Sample Data

Run the seed script to populate your database with sample data:

```bash
cd backend
npm run seed
```

This creates:
- Sample users (including admin user)
- Sample quests across different categories
- Realistic participation data

**Default Admin Credentials:**
- Email: `admin@questify.com`
- Password: `Admin123!`

## 🧪 Testing the Setup

### Backend Health Check

Visit `http://localhost:5000/health` - should return:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### API Key Test

Test the protected API endpoint:
```bash
curl -H "X-API-Key: your_api_key" http://localhost:5000/api/v1/info
```

### Frontend-Backend Connection

1. **Start both servers**
2. **Open frontend** at `http://localhost:3000`
3. **Check browser console** for any API errors
4. **Try registering** a new user account

## 🔍 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB is running
- Verify environment variables are set
- Check port 5000 isn't in use

**Frontend can't connect to backend:**
- Verify API URL in frontend `.env.local`
- Check API key matches between frontend and backend
- Ensure CORS is configured correctly

**Database connection fails:**
- Check MongoDB service is running
- Verify connection string format
- Check network connectivity (for Atlas)

**API key authentication fails:**
- Ensure API key is exactly the same in both environments
- Check for extra spaces or characters
- Regenerate API key if needed

### Debug Commands

**Check backend configuration:**
```bash
cd backend
node scripts/setup.js check
```

**Validate API key:**
```bash
cd backend
node utils/apiKeyGenerator.js validate your_api_key
```

**Test database connection:**
```bash
cd backend
node -e "require('./config/database'); console.log('DB connection test')"
```

## 📚 Next Steps

Once everything is running:

1. **Explore the API** at `http://localhost:5000`
2. **Register a user account** on the frontend
3. **Create your first quest**
4. **Join existing quests**
5. **Check the leaderboard**

## 🛠️ Development Workflow

### Making Changes

**Backend changes:**
- Server auto-restarts with nodemon
- Check logs in terminal

**Frontend changes:**
- Hot reload enabled
- Check browser console for errors

### Adding Features

1. **Backend**: Add routes → controllers → models
2. **Frontend**: Add pages → components → API calls
3. **Test**: Verify frontend-backend communication

## 📖 API Documentation

Key endpoints for frontend integration:

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

**Quests:**
- `GET /api/quests` - Get public quests
- `POST /api/quests` - Create quest (auth required)
- `POST /api/quests/:id/join` - Join quest (auth required)

**Protected API (requires API key):**
- `GET /api/v1/stats/overview` - App statistics
- `GET /api/v1/search/quests` - Search quests
- `GET /api/v1/leaderboard/users` - User leaderboard

## 🎉 Success!

If you can:
- ✅ Access frontend at `http://localhost:3000`
- ✅ Access backend at `http://localhost:5000`
- ✅ Register and login users
- ✅ Create and join quests
- ✅ See data in MongoDB

Then your Questify application is successfully set up and ready for development!

## 📞 Support

If you encounter issues:
1. Check this guide thoroughly
2. Review error messages in terminal/console
3. Verify all environment variables
4. Ensure all services are running

Happy coding! 🚀
