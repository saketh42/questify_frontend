# 🔗 Connecting Vercel Frontend to Backend

## Current Status
- ✅ **Frontend**: Deployed at `https://questify-frontend-three.vercel.app`
- ✅ **Backend**: Running locally on `http://localhost:5000`
- ✅ **CORS**: Updated to allow your Vercel domain
- ✅ **API Key**: `e0db16968c30ed27c942dda0c28bcc0767732707239eba819307c8d56751a358`

## 🚀 Quick Connection Steps

### Step 1: Expose Backend with ngrok
1. **Open a new terminal** and run:
   ```bash
   ngrok http 5000
   ```

2. **Copy the HTTPS URL** (something like `https://abc123.ngrok.io`)

### Step 2: Update Vercel Environment Variables
1. **Go to your Vercel dashboard**
2. **Select your project**: `questify-frontend-three`
3. **Go to Settings → Environment Variables**
4. **Add these variables**:

   ```env
   NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok.io/api
   NEXT_PUBLIC_API_KEY=e0db16968c30ed27c942dda0c28bcc0767732707239eba819307c8d56751a358
   ```

   **Replace `your-ngrok-url.ngrok.io` with your actual ngrok URL**

### Step 3: Redeploy Frontend
1. **Trigger a new deployment** in Vercel (or push to your git repo)
2. **Wait for deployment** to complete

### Step 4: Test the Connection
Visit `https://questify-frontend-three.vercel.app` and test:
- ✅ User registration
- ✅ User login
- ✅ Browse quests
- ✅ Create quests

## 🧪 Test Accounts Available

### Admin Account
- **Email**: `admin@questify.com`
- **Password**: `Admin123!`

### Sample Users
- **Email**: `john@example.com` | **Password**: `Password123!`
- **Email**: `jane@example.com` | **Password**: `Password123!`
- **Email**: `mike@example.com` | **Password**: `Password123!`

## 📊 Available Data
- **4 users** (all verified and active)
- **8 sample quests** across different categories:
  - Morning Workout Routine (Fitness)
  - Learn Programming Language (Learning)
  - Daily Meditation (Health)
  - Write Short Story (Creativity)
  - Organize Files (Productivity)
  - Connect with Friends (Social)
  - Learn Cooking (Hobby)
  - Plan Weekend Trip (Travel)

## 🔧 Alternative: Deploy Backend to Cloud

### Option 1: Railway (Recommended)
1. **Sign up** at [railway.app](https://railway.app)
2. **Connect your GitHub** repo
3. **Deploy** the backend folder
4. **Add environment variables** in Railway dashboard
5. **Get the public URL** and update Vercel

### Option 2: Render
1. **Sign up** at [render.com](https://render.com)
2. **Create new Web Service**
3. **Connect GitHub** repo
4. **Set build command**: `cd backend && npm install`
5. **Set start command**: `cd backend && npm start`

### Option 3: Heroku
1. **Install Heroku CLI**
2. **Create new app**: `heroku create questify-backend`
3. **Deploy**: `git subtree push --prefix backend heroku main`

## 🔍 Troubleshooting

### Frontend Can't Connect
- ✅ Check ngrok is running
- ✅ Verify API URL in Vercel env vars
- ✅ Ensure API key is correct
- ✅ Check browser console for errors

### Authentication Issues
- ✅ Verify CORS settings
- ✅ Check API key format
- ✅ Ensure backend is running

### Database Issues
- ✅ Verify MongoDB is running locally
- ✅ Check connection string
- ✅ Ensure sample data is seeded

## 📱 API Endpoints Your Frontend Can Use

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires JWT)

### Quests
- `GET /api/quests` - Get all public quests
- `GET /api/quests/featured` - Get featured quests
- `GET /api/quests/categories` - Get quest categories
- `POST /api/quests` - Create quest (requires JWT)
- `POST /api/quests/:id/join` - Join quest (requires JWT)
- `PUT /api/quests/:id/progress` - Update progress (requires JWT)

### Protected API (requires API key)
- `GET /api/v1/stats/overview` - App statistics
- `GET /api/v1/search/quests` - Search quests
- `GET /api/v1/leaderboard/users` - User leaderboard

## 🎯 Expected Frontend Behavior

Once connected, your frontend should be able to:

1. **Registration Flow**:
   - User fills registration form
   - POST to `/api/auth/register`
   - Receive JWT token
   - Redirect to dashboard

2. **Login Flow**:
   - User enters credentials
   - POST to `/api/auth/login`
   - Receive JWT token
   - Store token for future requests

3. **Quest Management**:
   - Fetch quests from `/api/quests`
   - Display quest cards
   - Allow quest creation
   - Enable quest participation

4. **User Dashboard**:
   - Show user stats
   - Display joined quests
   - Show progress tracking

## 🔐 Security Notes

- ✅ **API Key**: Required for protected endpoints
- ✅ **JWT Tokens**: Required for user-specific actions
- ✅ **CORS**: Configured for your domain
- ✅ **Rate Limiting**: 100 requests per 15 minutes
- ✅ **Input Validation**: All inputs validated
- ✅ **Password Hashing**: bcrypt with salt

## 🚀 Next Steps

1. **Set up ngrok** to expose backend
2. **Update Vercel environment variables**
3. **Test the connection**
4. **Consider deploying backend to cloud** for production

Your backend is fully ready and waiting for your frontend to connect! 🎉
