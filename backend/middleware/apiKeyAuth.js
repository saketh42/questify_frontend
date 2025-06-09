const crypto = require('crypto');

// API Key authentication middleware
const apiKeyAuth = (req, res, next) => {
  try {
    // Check for API key in headers
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key is required',
        error: 'MISSING_API_KEY',
      });
    }

    // Validate API key format (should be a valid format)
    if (typeof apiKey !== 'string' || apiKey.length < 32) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key format',
        error: 'INVALID_API_KEY_FORMAT',
      });
    }

    // In a production environment, you would validate against stored API keys
    // For now, we'll check against environment variable
    const validApiKey = process.env.API_KEY_SECRET;
    
    if (!validApiKey) {
      console.error('API_KEY_SECRET not configured in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
        error: 'SERVER_CONFIG_ERROR',
      });
    }

    // Compare API keys securely
    const providedKeyBuffer = Buffer.from(apiKey, 'utf8');
    const validKeyBuffer = Buffer.from(validApiKey, 'utf8');
    
    // Use crypto.timingSafeEqual to prevent timing attacks
    if (providedKeyBuffer.length !== validKeyBuffer.length || 
        !crypto.timingSafeEqual(providedKeyBuffer, validKeyBuffer)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key',
        error: 'INVALID_API_KEY',
      });
    }

    // API key is valid, add metadata to request
    req.apiKeyAuth = {
      authenticated: true,
      timestamp: new Date(),
    };

    next();
  } catch (error) {
    console.error('API Key authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: 'AUTH_ERROR',
    });
  }
};

// Generate a new API key (utility function)
const generateApiKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Validate API key format (utility function)
const isValidApiKeyFormat = (apiKey) => {
  return typeof apiKey === 'string' && 
         apiKey.length >= 32 && 
         /^[a-f0-9]+$/i.test(apiKey);
};

module.exports = {
  apiKeyAuth,
  generateApiKey,
  isValidApiKeyFormat,
};
