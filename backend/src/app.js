require('dotenv').config();

const express        = require('express');
const cors           = require('cors');
const helmet         = require('helmet');
const morgan         = require('morgan');
const swaggerUi      = require('swagger-ui-express');
const swaggerSpec    = require('./config/swagger');
const routes         = require('./routes');
const notFound       = require('./middlewares/notFound');
const errorHandler   = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Mundial API — Docs',
    swaggerOptions: { docExpansion: 'list' },
  }),
);

app.use('/api/v1', routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;