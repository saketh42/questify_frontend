const fs = require('fs');
const path = require('path');
const { generateNewApiKey } = require('../utils/apiKeyGenerator');

const setupBackend = () => {
  console.log('🚀 Setting up Questify Backend...\n');

  // Check if .env file exists
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      // Copy .env.example to .env
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ Created .env file from .env.example');
    } else {
      console.log('❌ .env.example file not found');
      return;
    }
  } else {
    console.log('ℹ️  .env file already exists');
  }

  // Generate API key
  const apiKey = generateNewApiKey();
  console.log('🔑 Generated new API key for frontend communication');

  // Read current .env content
  let envContent = fs.readFileSync(envPath, 'utf8');

  // Update API_KEY_SECRET if it's not set or is placeholder
  if (envContent.includes('API_KEY_SECRET=your_api_key_secret_for_frontend_backend_communication')) {
    envContent = envContent.replace(
      'API_KEY_SECRET=your_api_key_secret_for_frontend_backend_communication',
      `API_KEY_SECRET=${apiKey}`
    );
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated API_KEY_SECRET in .env file');
  } else if (!envContent.includes('API_KEY_SECRET=') || envContent.includes('API_KEY_SECRET=\n')) {
    // Add API_KEY_SECRET if missing
    envContent += `\nAPI_KEY_SECRET=${apiKey}\n`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Added API_KEY_SECRET to .env file');
  } else {
    console.log('ℹ️  API_KEY_SECRET already configured in .env file');
  }

  // Generate JWT secret if needed
  if (envContent.includes('JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex')) {
    const jwtSecret = generateNewApiKey() + generateNewApiKey(); // Extra long for JWT
    envContent = fs.readFileSync(envPath, 'utf8'); // Re-read in case it was updated
    envContent = envContent.replace(
      'JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex',
      `JWT_SECRET=${jwtSecret}`
    );
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Generated and set JWT_SECRET in .env file');
  }

  console.log('\n📋 Setup Summary:');
  console.log('- Environment file configured');
  console.log('- API key generated for frontend communication');
  console.log('- JWT secret configured');

  console.log('\n🔑 Your API Key (for frontend):');
  console.log(`${apiKey}`);

  console.log('\n📝 Next Steps:');
  console.log('1. Review and update .env file with your MongoDB URI');
  console.log('2. Install dependencies: npm install');
  console.log('3. Start MongoDB service');
  console.log('4. Seed database (optional): npm run seed');
  console.log('5. Start development server: npm run dev');

  console.log('\n🔗 Frontend Integration:');
  console.log('Add this API key to your frontend environment variables:');
  console.log(`NEXT_PUBLIC_API_KEY=${apiKey}`);
  console.log('API Base URL: http://localhost:5000/api');

  console.log('\n⚠️  Security Notes:');
  console.log('- Keep your API keys secure');
  console.log('- Never commit .env file to version control');
  console.log('- Use different keys for production');

  console.log('\n✨ Setup completed successfully!');
};

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'env':
      // Just setup environment
      setupBackend();
      break;

    case 'check':
      // Check current configuration
      console.log('🔍 Checking Questify Backend Configuration...\n');
      
      const envPath = path.join(__dirname, '..', '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
        
        console.log('📄 Environment Variables:');
        lines.forEach(line => {
          const [key, value] = line.split('=');
          if (key && value) {
            if (key.includes('SECRET') || key.includes('PASSWORD')) {
              console.log(`  ${key}=***hidden***`);
            } else {
              console.log(`  ${key}=${value}`);
            }
          }
        });

        // Check for required variables
        const required = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'API_KEY_SECRET'];
        const missing = required.filter(key => !envContent.includes(`${key}=`));
        
        if (missing.length > 0) {
          console.log('\n❌ Missing required variables:');
          missing.forEach(key => console.log(`  - ${key}`));
        } else {
          console.log('\n✅ All required variables are set');
        }
      } else {
        console.log('❌ .env file not found');
      }
      break;

    case 'reset':
      // Reset configuration
      console.log('🔄 Resetting Questify Backend Configuration...\n');
      const envPath2 = path.join(__dirname, '..', '.env');
      if (fs.existsSync(envPath2)) {
        fs.unlinkSync(envPath2);
        console.log('🗑️  Removed existing .env file');
      }
      setupBackend();
      break;

    default:
      console.log('\n🛠️  Questify Backend Setup Tool');
      console.log('Usage: node scripts/setup.js <command>');
      console.log('\nCommands:');
      console.log('  env     Setup environment configuration (default)');
      console.log('  check   Check current configuration');
      console.log('  reset   Reset configuration (removes .env and recreates)');
      console.log('\nExamples:');
      console.log('  node scripts/setup.js');
      console.log('  node scripts/setup.js env');
      console.log('  node scripts/setup.js check');
      console.log('  node scripts/setup.js reset');
      console.log('');
      
      if (!command) {
        setupBackend();
      }
      break;
  }
}

module.exports = { setupBackend };
