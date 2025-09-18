module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['your-image-domain.com'], // Add your image domains here
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:5000/api', // Set your API URL
  },
};