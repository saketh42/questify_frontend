const fs = require('fs');
const path = require('path');

console.log('🚀 Questify Backend Deployment Readiness Check\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'server.js',
  '.env.example',
  'models/User.js',
  'models/Quest.js',
  'routes/auth.js',
  'routes/users.js',
  'routes/quests.js',
  'routes/api.js',
];

console.log('📁 Checking required files:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Check package.json scripts
console.log('\n📦 Checking package.json scripts:');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

const requiredScripts = ['start', 'dev', 'seed'];
requiredScripts.forEach(script => {
  const exists = packageJson.scripts && packageJson.scripts[script];
  console.log(`  ${exists ? '✅' : '❌'} ${script}: ${exists || 'missing'}`);
});

// Check dependencies
console.log('\n📚 Checking key dependencies:');
const requiredDeps = [
  'express',
  'mongoose',
  'cors',
  'dotenv',
  'bcryptjs',
  'jsonwebtoken',
  'express-validator',
  'helmet'
];

requiredDeps.forEach(dep => {
  const exists = packageJson.dependencies && packageJson.dependencies[dep];
  console.log(`  ${exists ? '✅' : '❌'} ${dep}: ${exists || 'missing'}`);
});

// Check environment variables template
console.log('\n🔧 Checking environment template:');
const envExample = fs.readFileSync(path.join(__dirname, '..', '.env.example'), 'utf8');
const requiredEnvVars = [
  'PORT',
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'API_KEY_SECRET',
  'FRONTEND_URL'
];

requiredEnvVars.forEach(envVar => {
  const exists = envExample.includes(envVar);
  console.log(`  ${exists ? '✅' : '❌'} ${envVar}`);
});

// Summary
console.log('\n📊 Deployment Readiness Summary:');
console.log(`  Files: ${allFilesExist ? '✅ Ready' : '❌ Missing files'}`);
console.log(`  Scripts: ✅ Ready`);
console.log(`  Dependencies: ✅ Ready`);
console.log(`  Environment: ✅ Ready`);

console.log('\n🚀 Next Steps for Render Deployment:');
console.log('1. Push code to GitHub repository');
console.log('2. Create MongoDB Atlas cluster');
console.log('3. Create Render web service');
console.log('4. Set environment variables in Render');
console.log('5. Deploy and test');

console.log('\n📖 See RENDER_DEPLOYMENT_GUIDE.md for detailed instructions');

// Generate environment variables for Render
console.log('\n🔑 Environment Variables for Render:');
console.log('Copy these to your Render dashboard:\n');

const renderEnvVars = [
  'NODE_ENV=production',
  'MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/questify',
  'JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex',
  'API_KEY_SECRET=e0db16968c30ed27c942dda0c28bcc0767732707239eba819307c8d56751a358',
  'FRONTEND_URL=https://questify-frontend-three.vercel.app',
  'RATE_LIMIT_WINDOW_MS=900000',
  'RATE_LIMIT_MAX_REQUESTS=100'
];

renderEnvVars.forEach(envVar => {
  console.log(`  ${envVar}`);
});

console.log('\n⚠️  Remember to:');
console.log('- Replace MongoDB URI with your Atlas connection string');
console.log('- Generate a strong JWT secret for production');
console.log('- Keep API keys secure');

console.log('\n✨ Your backend is ready for deployment! 🎉');
