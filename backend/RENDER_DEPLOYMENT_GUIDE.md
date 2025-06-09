# 🚀 Deploy Questify Backend to Render

## Prerequisites
- ✅ Backend code ready in `QUESTIFY/backend`
- ✅ GitHub account
- ✅ Render account (free)

## Step 1: Push Backend to GitHub

### Option A: Create New Repository
1. **Create new GitHub repository** named `questify-backend`
2. **Initialize git in backend folder**:
   ```bash
   cd QUESTIFY/backend
   git init
   git add .
   git commit -m "Initial backend setup"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/questify-backend.git
   git push -u origin main
   ```

### Option B: Use Existing Repository
1. **Push backend folder** to your existing repo
2. **Ensure backend code** is in a `backend` folder

## Step 2: Set Up MongoDB Atlas (Cloud Database)

### Create MongoDB Atlas Account
1. **Go to** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Sign up** for free account
3. **Create new cluster** (free tier)
4. **Create database user**:
   - Username: `questify-user`
   - Password: Generate strong password
5. **Whitelist IP addresses**: Add `0.0.0.0/0` (allow all)
6. **Get connection string**: 
   ```
   mongodb+srv://questify-user:PASSWORD@cluster0.xxxxx.mongodb.net/questify?retryWrites=true&w=majority
   ```

## Step 3: Deploy to Render

### Create Render Account
1. **Go to** [Render.com](https://render.com)
2. **Sign up** with GitHub account
3. **Connect your GitHub** repository

### Deploy Web Service
1. **Click "New +"** → **Web Service**
2. **Connect repository**: Select your backend repo
3. **Configure deployment**:

   **Basic Settings:**
   - **Name**: `questify-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend` (if in subfolder)

   **Build & Deploy:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Environment Variables
Add these in Render dashboard:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://questify-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/questify?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
API_KEY_SECRET=e0db16968c30ed27c942dda0c28bcc0767732707239eba819307c8d56751a358
FRONTEND_URL=https://questify-frontend-three.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important**: Replace `YOUR_PASSWORD` with your MongoDB Atlas password

## Step 4: Deploy and Test

### Deploy
1. **Click "Create Web Service"**
2. **Wait for deployment** (5-10 minutes)
3. **Get your Render URL**: `https://questify-backend.onrender.com`

### Test Deployment
1. **Health Check**: Visit `https://questify-backend.onrender.com/health`
2. **API Test**: Visit `https://questify-backend.onrender.com/api/quests`

## Step 5: Seed Production Database

### Option A: Manual Seeding
1. **Go to Render dashboard**
2. **Open Shell** for your service
3. **Run**: `npm run seed`

### Option B: API Seeding
Create a temporary seeding endpoint (remove after use):

```javascript
// Add to server.js temporarily
app.post('/api/admin/seed', async (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    return res.status(403).json({ message: 'Not allowed' });
  }
  
  // Run seeding logic here
  const { seedDatabase } = require('./scripts/seed');
  await seedDatabase();
  
  res.json({ message: 'Database seeded successfully' });
});
```

## Step 6: Update Vercel Frontend

### Update Environment Variables
In your Vercel dashboard, update:

```env
NEXT_PUBLIC_API_URL=https://questify-backend.onrender.com/api
NEXT_PUBLIC_API_KEY=e0db16968c30ed27c942dda0c28bcc0767732707239eba819307c8d56751a358
```

### Redeploy Frontend
1. **Trigger new deployment** in Vercel
2. **Test the connection**

## Step 7: Verify Everything Works

### Test These Endpoints:
- ✅ `GET /health` - Health check
- ✅ `GET /api/quests` - Get quests
- ✅ `POST /api/auth/register` - User registration
- ✅ `POST /api/auth/login` - User login
- ✅ `GET /api/v1/stats/overview` - Protected endpoint

### Test Accounts:
- **Admin**: `admin@questify.com` / `Admin123!`
- **User**: `john@example.com` / `Password123!`

## Troubleshooting

### Common Issues:

**Build Fails:**
- Check Node.js version compatibility
- Verify package.json scripts
- Check for missing dependencies

**Database Connection Fails:**
- Verify MongoDB Atlas connection string
- Check IP whitelist settings
- Ensure database user has correct permissions

**CORS Issues:**
- Verify FRONTEND_URL environment variable
- Check Render logs for CORS errors

**Environment Variables:**
- Double-check all required variables are set
- Ensure no typos in variable names
- Verify sensitive values are correct

### Render Logs:
- **View logs** in Render dashboard
- **Check for errors** during startup
- **Monitor API requests**

## Production Considerations

### Security:
- ✅ Environment variables secured
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Input validation active

### Performance:
- ✅ Database indexing
- ✅ Connection pooling
- ✅ Compression enabled
- ✅ Caching headers

### Monitoring:
- ✅ Health check endpoint
- ✅ Error logging
- ✅ Request logging
- ✅ Performance metrics

## Final URLs

After successful deployment:

- **Backend API**: `https://questify-backend.onrender.com`
- **Health Check**: `https://questify-backend.onrender.com/health`
- **API Documentation**: `https://questify-backend.onrender.com/`
- **Frontend**: `https://questify-frontend-three.vercel.app`

## Next Steps

1. **Test all functionality** end-to-end
2. **Monitor performance** and logs
3. **Set up custom domain** (optional)
4. **Configure monitoring** alerts
5. **Plan for scaling** if needed

Your Questify backend will be live and ready for production use! 🎉
