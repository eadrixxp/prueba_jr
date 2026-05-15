require('dotenv').config();

const app  = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    // Verificar conexión a PostgreSQL antes de arrancar
    await pool.query('SELECT 1');
    console.log(' Conexión a PostgreSQL establecida');

    app.listen(PORT, () => {
      console.log(` Servidor corriendo en http://localhost:${PORT}`);
      console.log(` Documentación: http://localhost:${PORT}/api/docs`);
      console.log(` Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error(' Error al conectar con PostgreSQL:', err.message);
    process.exit(1);
  }
};

start();