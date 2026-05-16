const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:3000/api/v1',
  },
  production: {
    API_BASE_URL: 'https://pruebajr-production.up.railway.app/api/v1',
  },
};

const CONFIG = ENV['production'];