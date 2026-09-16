/**
 * Centralised access to environment variables so the rest of the
 * application reads from a single, validated source.
 */
const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
};

module.exports = config;
