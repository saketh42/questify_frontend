const crypto = require('crypto');
const { generateApiKey, isValidApiKeyFormat } = require('../middleware/apiKeyAuth');

/**
 * Generate a new API key for frontend-backend communication
 * @returns {string} Generated API key
 */
const generateNewApiKey = () => {
  return generateApiKey();
};

/**
 * Validate API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} True if valid format
 */
const validateApiKeyFormat = (apiKey) => {
  return isValidApiKeyFormat(apiKey);
};

/**
 * Generate multiple API keys
 * @param {number} count - Number of API keys to generate
 * @returns {string[]} Array of generated API keys
 */
const generateMultipleApiKeys = (count = 1) => {
  const keys = [];
  for (let i = 0; i < count; i++) {
    keys.push(generateNewApiKey());
  }
  return keys;
};

/**
 * Generate API key with metadata
 * @param {string} name - Name/description for the API key
 * @param {string[]} permissions - Array of permissions
 * @returns {object} API key object with metadata
 */
const generateApiKeyWithMetadata = (name = 'Default', permissions = ['read']) => {
  return {
    key: generateNewApiKey(),
    name,
    permissions,
    createdAt: new Date(),
    isActive: true,
  };
};

/**
 * Hash API key for secure storage
 * @param {string} apiKey - API key to hash
 * @returns {string} Hashed API key
 */
const hashApiKey = (apiKey) => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
};

/**
 * Compare API key with hash
 * @param {string} apiKey - Plain API key
 * @param {string} hash - Hashed API key
 * @returns {boolean} True if they match
 */
const compareApiKey = (apiKey, hash) => {
  const hashedInput = hashApiKey(apiKey);
  return crypto.timingSafeEqual(
    Buffer.from(hashedInput, 'hex'),
    Buffer.from(hash, 'hex')
  );
};

// CLI script functionality
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'generate':
      const count = parseInt(args[1]) || 1;
      const keys = generateMultipleApiKeys(count);
      console.log('\n🔑 Generated API Key(s):');
      keys.forEach((key, index) => {
        console.log(`${index + 1}. ${key}`);
      });
      console.log('\n📝 Add this to your .env file as API_KEY_SECRET');
      console.log('⚠️  Keep this key secure and never commit it to version control!\n');
      break;

    case 'validate':
      const keyToValidate = args[1];
      if (!keyToValidate) {
        console.log('❌ Please provide an API key to validate');
        console.log('Usage: node apiKeyGenerator.js validate <api-key>');
        process.exit(1);
      }
      
      const isValid = validateApiKeyFormat(keyToValidate);
      console.log(`\n🔍 API Key Validation Result:`);
      console.log(`Key: ${keyToValidate}`);
      console.log(`Valid: ${isValid ? '✅ Yes' : '❌ No'}`);
      console.log(`Length: ${keyToValidate.length} characters\n`);
      break;

    case 'hash':
      const keyToHash = args[1];
      if (!keyToHash) {
        console.log('❌ Please provide an API key to hash');
        console.log('Usage: node apiKeyGenerator.js hash <api-key>');
        process.exit(1);
      }
      
      const hash = hashApiKey(keyToHash);
      console.log(`\n🔐 API Key Hash:`);
      console.log(`Original: ${keyToHash}`);
      console.log(`Hash: ${hash}\n`);
      break;

    case 'metadata':
      const name = args[1] || 'Frontend App';
      const permissions = args.slice(2).length > 0 ? args.slice(2) : ['read', 'write'];
      const keyWithMetadata = generateApiKeyWithMetadata(name, permissions);
      
      console.log('\n🔑 Generated API Key with Metadata:');
      console.log(JSON.stringify(keyWithMetadata, null, 2));
      console.log('\n📝 Add the key to your .env file as API_KEY_SECRET');
      console.log('⚠️  Keep this key secure and never commit it to version control!\n');
      break;

    default:
      console.log('\n🔑 Questify API Key Generator');
      console.log('Usage: node apiKeyGenerator.js <command> [options]');
      console.log('\nCommands:');
      console.log('  generate [count]     Generate API key(s) (default: 1)');
      console.log('  validate <key>       Validate API key format');
      console.log('  hash <key>          Generate hash for API key');
      console.log('  metadata <name> [permissions...]  Generate key with metadata');
      console.log('\nExamples:');
      console.log('  node apiKeyGenerator.js generate');
      console.log('  node apiKeyGenerator.js generate 3');
      console.log('  node apiKeyGenerator.js validate abc123...');
      console.log('  node apiKeyGenerator.js metadata "Frontend App" read write admin');
      console.log('');
      break;
  }
}

module.exports = {
  generateNewApiKey,
  validateApiKeyFormat,
  generateMultipleApiKeys,
  generateApiKeyWithMetadata,
  hashApiKey,
  compareApiKey,
};
